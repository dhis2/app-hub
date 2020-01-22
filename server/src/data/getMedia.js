const debug = require('debug')('apphub:server:data:getMedia')
/**
 * Gets information about an image/media
 *
 * @param {string} id id for the media to retreive
 * @param {*} knex db instance
 * @param {Promise<object>}
 */
const getMedia = (id, knex) => {
    try {
        return knex('app_version_media')
            .innerJoin(
                'app_version',
                'app_version.id',
                'app_version_media.app_version_id'
            )
            .select({
                media_id: 'app_version_media.id',
                version_id: 'app_version.id',
                image_type: 'app_version_media.image_type',
                original_filename: 'app_version_media.original_filename',
                caption: 'app_version_media.caption',
                description: 'app_version_media.description',
            })
            .where('app_version_media.id', id)
            .first()
    } catch (err) {
        //TODO: log, re-throw or something other than silent fail?
        debug(err)
        throw err
    }
}

module.exports = getMedia
