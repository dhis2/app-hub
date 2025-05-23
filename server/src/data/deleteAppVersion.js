const debug = require('debug')('apphub:server:data:deleteAppVersion')
/**
 * Deletes an app version with the specified uuid
 *
 * @param {string} id id for the app version to delete
 * @param {object} knex DB instance or transaction
 * @returns {Promise}
 */
const deleteAppVersion = async (id, knex) => {
    try {
        await knex('app_version').where('id', id).del()
        debug('deleted app version', id)
    } catch (err) {
        debug(err)
        throw new Error(`Could not delete app version '${id}'`)
    }
}

module.exports = deleteAppVersion
