const slugify = require('slugify')
const { NotFoundError } = require('../utils/errors')
const User = require('../models/v2/User')
const Organisation = require('../models/v2/Organisation')

const getOrganisationQuery = db =>
    db('organisation').select(
        'organisation.id',
        'organisation.name',
        'organisation.slug',
        'organisation.created_by_user_id',
        'organisation.updated_at',
        'organisation.created_at'
    )

/**
 * Creates an organisation.
 *
 * Note that this does not add the user to the organisation
 * TODO: should this add the user, or is that up to the handler?
 * @param object data
 * @param {string} data.userId User id creating the data
 * @param {*} db
 */
const create = async ({ userId, name }, db) => {
    const slug = await ensureUniqueSlug(slugify(name, { lower: true }), db)
    const obj = {
        owner: userId,
        name,
        slug,
    }
    const dbData = Organisation.formatDatabaseJson(obj)
    const [organisation] = await db('organisation')
        .insert(dbData)
        .returning(['id'])

    return Organisation.parseDatabaseJson(organisation)
}

const ensureUniqueSlug = async (originalSlug, db) => {
    let slug = originalSlug
    let slugUniqueness = 2
    let foundUniqueSlug = false
    while (!foundUniqueSlug) {
        const [{ count }] = await db('organisation')
            .count('id')
            .where('slug', slug)
        if (count > 0) {
            slug = `${originalSlug}-${slugUniqueness}`
            slugUniqueness++
        } else {
            foundUniqueSlug = true
        }
    }

    return slug
}

const find = async ({ filters }, db) => {
    const query = getOrganisationQuery(db)

    if (filters) {
        // special filter for gettings orgs for a particular user
        const userFilter = filters.getFilter('user')
        if (userFilter) {
            const userOrganisations = db('user_organisation')
                .select('organisation_id')
                .where('user_id', userFilter.value)
            filters.markApplied('user')
            query.whereIn('organisation.id', userOrganisations)
        }
        filters.applyAllToQuery(query, { tableName: 'organisation' })
    }
    const res = await query
    const parsed = Organisation.parseDatabaseJson(res)

    return parsed
}

const findOne = async (id, includeUsers = false, db) => {
    const organisation = await getOrganisationQuery(db)
        .first()
        .where('organisation.id', id)
    if (!organisation) {
        throw new NotFoundError(`Organisation Not Found`)
    }

    if (includeUsers) {
        const users = await db('users')
            .select('users.id', 'users.email', 'users.name')
            .innerJoin(
                'user_organisation',
                'users.id',
                'user_organisation.user_id'
            )
            .where('user_organisation.organisation_id', organisation.id)
        organisation.users = users
    }
    const internalOrg = Organisation.parseDatabaseJson(organisation)

    return internalOrg
}

const update = async (id, updateData, db) => {
    const dbData = Organisation.formatDatabaseJson(updateData)

    return db('organisation')
        .update(dbData)
        .where({ id })
}

const addUserById = async (id, userId, db) => {
    const query = await db('user_organisation').insert({
        user_id: userId,
        organisation_id: id,
    })
    return query
}

const removeUser = async (id, userId, db) => {
    const query = await db('user_organisation')
        .where({
            user_id: userId,
            organisation_id: id,
        })
        .del()

    return query
}
const remove = async (id, db) => {
    await db('organisation')
        .where({ id })
        .delete()
}

module.exports = {
    find,
    findOne,
    addUserById,
    create,
    update,
    remove,
    removeUser,
}
