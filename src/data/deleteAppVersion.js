const debug = require('debug')('apphub:server:data:deleteAppVersion')
/**
 * Deletes an app version with the specified uuid
 *
 * @param {string} uuid UUID for the app version to delete
 * @param {object} knex database connection
 * @param {object} transaction database transaction
 * @returns {Promise}
 */
const deleteAppVersion = async (uuid, knex, transaction) => {
    try {
        await knex('app_version')
            .transacting(transaction)
            .where('uuid', uuid)
            .del()
        debug('deleted app version', uuid)
    } catch (err) {
        debug(err)
        throw new Error(`Could not delete app version '${uuid}'`)
    }
}

module.exports = deleteAppVersion
