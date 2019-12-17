const debug = require('debug')('apphub:server:data:deleteApp')
/**
 * Deletes an app with the specified uuid
 *
 * @param {string} id id for the app to delete
 * @returns {Promise}
 */
const deleteApp = async (id, knex, transaction) => {
    try {
        await knex('app')
            .transacting(transaction)
            .where('id', id)
            .del()
        debug('deleted app', id)
    } catch (err) {
        debug(err)
        throw new Error(`Could not delete app ${id}`)
    }
}

module.exports = deleteApp
