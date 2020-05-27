const debug = require('debug')('apphub:server:data:deleteApp')
/**
 * Deletes an app with the specified uuid
 *
 * @param {string} id id for the app to delete
 * @param {object} knex DB instance or transaction
 * @returns {Promise}
 */
const deleteApp = async (id, knex) => {
    try {
        await knex('app')
            .where('id', id)
            .del()
        debug('deleted app', id)
    } catch (err) {
        debug(err)
        throw new Error(`Could not delete app ${id}`)
    }
}

module.exports = deleteApp
