const getAppsByUuid = require('./getAppsByUuid')

/**
 * Returns the developer id for the app with specified UUID
 * @param {string} appUuid UUID of the app to fetch developer id for
 * @param {object} db Knex instance
 */
const getAppDeveloperId = async (appUuid, db) => {
    try {
        const [firstApp] = await getAppsByUuid(params.uuid, 'en', db)
        return firstApp.developer_id
    } catch (err) {
        return false
    }
}

module.exports = getAppDeveloperId
