const debug = require('debug')('appstore:server:data:deleteMedia')
/**
 * Deletes a media with the specified uuid
 *
 * @param {string} uuid UUID for the media to delete
 * @param {object} knex db instance
 * @returns {Promise}
 */
const deleteMedia = async (uuid, knex, transaction) => {
    try {
        await knex('app_version_media')
            .transacting(transaction)
            .where('uuid', uuid)
            .del()
        debug('deleted media', uuid)
    } catch (err) {
        debug(err)
        throw new Error(`Could not delete app media for: ${uuid}`)
    }
}

module.exports = deleteMedia
