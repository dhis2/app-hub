const debug = require('debug')('apphub:server:data:getMedia')
/**
 * Gets information about an image/media
 *
 * @param {string} uuid UUID for the media to retreive
 * @param {*} knex db instance
 * @param {Promise<object>}
 */
const getMedia = (uuid, knex) => {
    try {
        return knex('app_version_media')
            .innerJoin(
                'app_version',
                'app_version.id',
                'app_version_media.app_version_id'
            )
            .select({
                media_uuid: 'app_version_media.uuid',
                version_uuid: 'app_version.uuid',
                image_type: 'app_version_media.image_type',
                original_filename: 'app_version_media.original_filename',
                caption: 'app_version_media.caption',
                description: 'app_version_media.description',
            })
            .where('app_version_media.uuid', uuid)
            .first()
    } catch (err) {
        //TODO: log, re-throw or something other than silent fail?
        debug(err)
        throw err
    }
}

module.exports = getMedia
