const getAppById = require('./getAppById')

const debug = require('debug')('apphub:server:data:getAppDeveloperIp')
/**
 * Returns the developer id for the app with specified UUID
 * @param {string} id id of the app to fetch developer id for
 * @param {object} db Knex instance
 */
const getAppDeveloperId = async (id, db) => {
    try {
        const apps = await getAppById(id, 'en', db)
        debug(`got apps for id ${id}:`, apps)
        return apps[0].developer_id
    } catch (err) {
        return false
    }
}

module.exports = getAppDeveloperId
