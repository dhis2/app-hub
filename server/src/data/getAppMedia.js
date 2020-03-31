const debug = require('debug')('apphub:server:data:getAppMedia')
/**
 * Returns the app-media object
 *
 * @param {string} id id for the app-media to retreive
 * @param {*} knex db instance
 * @param {Promise<object>}
 */
const getAppMedia = (id, knex) => {
    try {
        return knex('app_media_view')
            .select(
                'media_id',
                'app_id',
                'image_type',
                'original_filename',
                'mime'
            )
            .where('app_media_id', id)
            .first()
    } catch (err) {
        //TODO: log, re-throw or something other than silent fail?
        debug(err)
        throw err
    }
}

module.exports = getAppMedia
