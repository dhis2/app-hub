const getAppsByUuid = require('./getAppsByUuid')

/**
 * Returns true if userId matches developerId for the app with the specified UUID
 * @param {object} params
 * @param {string} params.uuid UUID of the app to check
 * @param {number} params.userId UserId to see if it's the developer of the app
 * @param {object} db Knex instance
 */
const userIsDeveloperOfAppWithUuid = async (params, db) => {
    try {
        const [firstApp] = await getAppsByUuid(params.uuid, 'en', db)
        return firstApp.developer_id === params.userId
    } catch (err) {
        return false
    }
}

module.exports = userIsDeveloperOfAppWithUuid
