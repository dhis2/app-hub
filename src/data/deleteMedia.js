/**
 * Deletes a media with the specified uuid
 *
 * @param {string} uuid UUID for the media to delete
 * @param {object} knex db instance
 * @returns {Promise}
 */
const deleteMedia = async (uuid, knex) => {
    return knex('app_version_media')
        .where('uuid', uuid)
        .del()
}

module.exports = deleteMedia
