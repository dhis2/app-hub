/**
 * Deletes a media with the specified uuid
 *
 * @param {string} uuid UUID for the media to delete
 * @param {object} knex db instance
 * @param {object} transaction db transaction to operate on
 * @returns {Promise}
 */
const deleteMedia = (uuid, knex, transaction) => {
    return knex('app_version_media')
        .transacting(transaction)
        .where('uuid', uuid)
        .del()
}

module.exports = deleteMedia
