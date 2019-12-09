const debug = require('debug')('apphub:server:data:deleteApp')
/**
 * Deletes an app with the specified uuid
 *
 * @param {string} uuid UUID for the app to delete
 * @returns {Promise}
 */
const deleteApp = async (uuid, knex, transaction) => {
    try {
        await knex('app')
            .transacting(transaction)
            .where('uuid', uuid)
            .del()
        debug('deleted app', uuid)
    } catch (err) {
        debug(err)
        throw new Error(`Could not delete app ${uuid}`)
    }
}

module.exports = deleteApp
