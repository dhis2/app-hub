/**
 * Returns all apps for a specific user
 *
 * @param {string} uuid User UUID to get apps for
 * @param {object} dbConnection db instance
 * @returns {Promise<Array>}
 */
const getAllAppsByDeveloperUuid = (uuid, knex) => {
    if (!uuid) {
        throw new Error('Missing/invalid paramter: uuid')
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    return knex('apps_view')
        .select()
        .where({
            developer_uuid: uuid,
        })
}

module.exports = getAllAppsByDeveloperUuid
