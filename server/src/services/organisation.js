const Boom = require('@hapi/boom')
const JWT = require('jsonwebtoken')
const Organisation = require('../models/v2/Organisation')
const { NotFoundError } = require('../utils/errors')
const { slugify } = require('../utils/slugify')

const getOrganisationQuery = db =>
    db('organisation').select(
        'organisation.id',
        'organisation.name',
        'organisation.email',
        'organisation.slug',
        'organisation.created_by_user_id',
        'organisation.updated_at',
        'organisation.created_at'
    )

const checkSlugExists = async (slug, knex) => {
    const slugMatch = await knex('organisation')
        .select('name')
        .where('slug', slug)
        .limit(1)
    if (slugMatch.length > 0) {
        return slugMatch[0].name
    }
    return false
}

const ensureUniqueSlug = async (slug, knex) => {
    const matchedOrgName = await checkSlugExists(slug, knex)
    if (matchedOrgName) {
        throw Boom.conflict(
            `Organisation already exists or is too similar to existing organisation (${matchedOrgName})`
        )
    }
    return slug
}

/**
 * Creates an organisation.
 *
 * Note that this does not add the user to the organisation
 * TODO: should this add the user, or is that up to the handler?
 * @param object data
 * @param {string} data.userId User id creating the data
 * @param {*} db
 */
const create = async ({ userId, name, email }, db) => {
    const slug = await ensureUniqueSlug(slugify(name), db)
    const obj = {
        owner: userId,
        name,
        slug,
        email,
    }
    const dbData = Organisation.formatDatabaseJson(obj)
    const [organisation] = await db('organisation')
        .insert(dbData)
        .returning(['id'])

    return Organisation.parseDatabaseJson(organisation)
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

const findOneByColumn = async (
    columnValue,
    { columnName = 'id', includeUsers = false } = {},
    knex
) => {
    const organisation = await getOrganisationQuery(knex)
        .first()
        .where(`organisation.${columnName}`, columnValue)
    if (!organisation) {
        throw new NotFoundError(`Organisation Not Found`)
    }
    if (includeUsers) {
        const users = await getUsersInOrganisation(organisation.id, knex)
        organisation.users = users
    }
    const internalOrg = Organisation.parseDatabaseJson(organisation)

    return internalOrg
}

const findOne = async (id, includeUsers = false, knex) => {
    return findOneByColumn(id, { columnName: 'id', includeUsers }, knex)
}

const findOneBySlug = async (slug, includeUsers = false, knex) => {
    return findOneByColumn(slug, { columnName: 'slug', includeUsers }, knex)
}

const getUsersInOrganisation = async (orgId, knex) => {
    const users = await knex('users')
        .select('users.id', 'users.email', 'users.name')
        .innerJoin('user_organisation', 'users.id', 'user_organisation.user_id')
        .where('user_organisation.organisation_id', orgId)
    return users || []
}

const update = async (id, updateData, db) => {
    const dbData = Organisation.formatDatabaseJson(updateData)

    // update slug if name changed
    if (updateData.name) {
        const slug = slugify(updateData.name)
        // check if slug exists, but allow current org's slug to be the same (eg. case of name updated)
        const slugMatch = await db('organisation')
            .select('name')
            .where('slug', slug)
            .whereNot('id', id)
            .limit(1)
        if (slugMatch.length > 0) {
            throw Boom.conflict(
                `Organisation already exists or is too similar to existing organisation (${slugMatch[0].name})`
            )
        }

        dbData.slug = slug
    }

    return db('organisation').update(dbData).where({ id })
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
    await db('organisation').where({ id }).delete()
}

const hasUser = async (id, userId, knex) => {
    const hasUser = await knex('user_organisation')
        .select(1)
        .where({
            organisation_id: id,
            user_id: userId,
        })
        .limit(1)
    return hasUser.length > 0
}

const generateInvitationToken = ({ organisation, user }, emailTo) => {
    const secret = process.env.INTERNAL_JWT_SECRET

    const decoded = {
        from: { id: user.id, name: user.name },
        emailTo,
        sub: organisation.id,
        organisation: organisation.name,
    }

    const token = JWT.sign(decoded, secret, {
        expiresIn: 60 * 60 * 24 * 2, //48 hrs
    })
    return {
        decoded,
        token,
    }
}

module.exports = {
    find,
    findOne,
    findOneBySlug,
    addUserById,
    create,
    update,
    remove,
    removeUser,
    hasUser,
    getUsersInOrganisation,
    generateInvitationToken,
    ensureUniqueSlug,
}
