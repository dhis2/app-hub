/**
 * Returns all apps for a specific user
 *
 * @param {string} id User id to get apps for
 * @param {object} dbConnection db instance
 * @returns {Promise<Array>}
 */
const getAllAppsByDeveloperId = (id, knex) => {
    if (!id) {
        throw new Error('Missing/invalid paramter: id')
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    return knex('apps_view')
        .select()
        .where({
            developer_id: id,
        })
}

module.exports = getAllAppsByDeveloperId
