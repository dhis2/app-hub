const debug = require('debug')('apphub:server:data:deleteMedia')
/**
 * Deletes a media with the specified id
 *
 * @param {string} id id for the media to delete
 * @param {object} knex db instance
 * @returns {Promise}
 */
const deleteAppMedia = async (id, knex, transaction) => {
    try {
        await knex('app_media')
            .transacting(transaction)
            .where('id', id)
            .del()
        debug('deleted app_media', id)
    } catch (err) {
        debug(err)
        throw new Error(`Could not delete app media for: ${id}`)
    }
}

module.exports = deleteAppMedia
