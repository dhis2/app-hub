const joi = require('@hapi/joi')
const slugify = require('slugify')
const uuid = require('uuid/v4')
const { applyFiltersToQuery } = require('../../utils/databaseUtils')
const { NotFoundError } = require('../../utils/errors')
const Boom = require('@hapi/boom')
const User = require('../../models/v2/User')
const Organisation = require('../../models/v2/Organisation')

const getOrganisationQuery = db =>
    db('organisation')
        .select(
            'organisation.id',
            'organisation.uuid',
            'organisation.name',
            'organisation.slug',
            db.ref('u.uuid').as('created_by_user_uuid'),
            db.ref('u.id').as('created_by_user_id')
        )
        .innerJoin(
            db.ref('users').as('u'),
            'organisation.created_by_user_id',
            'u.id'
        )

async function create({ userId, name }, db) {
    const slug = await ensureUniqueSlug(slugify(name, { lower: true }), db)
    const obj = {
        createdByUserId: userId,
        name,
        slug,
        uuid: uuid(),
    }
    const dbData = joi.attempt(obj, Organisation.dbDefinition)
    const [organisation] = await db('organisation')
        .insert(dbData)
        .returning(['id', 'uuid'])

    return Organisation.parseDatabaseJson(organisation)
}

async function ensureUniqueSlug(originalSlug, db) {
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

async function find({ filter, paging }, db) {
    const query = getOrganisationQuery(db)

    if (filter) {
        // special filter for gettings orgs for a particular user
        if (filter.userUuid) {
            const userOrganisations = db('user_organisation')
                .select('organisation_id')
                .innerJoin('users', 'user_organisation.user_id', 'users.id')
                .where('users.uuid', filter.userUuid)

            query.whereIn('organisation.id', userOrganisations)
            delete filter.userUuid
        }
        applyFiltersToQuery(filter, query, { tableName: 'organisation' })
    }
    const res = await query
    const parsed = Organisation.parseDatabaseJson(res)

    return parsed
}

async function findByUuid(uuid, includeUsers = false, db) {
    const organisation = await getOrganisationQuery(db)
        .first()
        .where('organisation.uuid', uuid)
    if (!organisation) {
        throw new NotFoundError(`Organisation with uuid ${uuid} not found.`)
    }

    const internalOrg = Organisation.parseDatabaseJson(organisation)

    if (includeUsers) {
        const users = await db('users')
            .select('users.uuid', 'users.email', 'users.name')
            .innerJoin(
                'user_organisation',
                'users.id',
                'user_organisation.user_id'
            )
            .where('user_organisation.organisation_id', organisation.id)
        internalOrg.users = User.parseDatabaseJson(users)
    }

    return internalOrg
}

async function addUserById(uuid, userId, db) {
    const org = await findByUuid(uuid, false, db)

    const query = await db('user_organisation').insert({
        user_id: userId,
        organisation_id: org.id,
    })

    return query
}

async function remove(uuid, db) {
    await db('organisation')
        .where({ uuid })
        .delete()
}

async function setCreatedByUserId(uuid, userId, db) {
    const dbData = joi.attempt(
        {
            createdByUserId: userId,
        },
        Organisation.dbDefinition
    )

    await db('organisation')
        .update(dbData)
        .where({ uuid })
}

module.exports = {
    find,
    findByUuid,
    addUserById,
    create,
    remove,
    setCreatedByUserId,
}
