const debug = require('debug')('apphub:server:data:getOrganisationAppsByUserId')

/**
 * Returns all apps that a user has access to manage (the apps that belong to the organisations the user has access to)
 *
 * @param {string} id User id to get apps for
 * @param {object} dbConnection db instance
 * @returns {Promise<Array>}
 */
const getOrganisationAppsByUserId = async (id, knex) => {
    if (!id) {
        throw new Error('Missing/invalid paramter: id')
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const appIds = await knex('app')
        .select('id')
        .innerJoin(
            'user_organisation',
            'user_organisation.organisation_id',
            'app.organisation_id'
        )
        .where({
            'user_organisation.user_id': id,
        })
        .pluck('id')

    debug('The user has access to apps:', appIds)

    return knex('apps_view')
        .select()
        .where('app_id', 'in', appIds)
}

module.exports = getOrganisationAppsByUserId
