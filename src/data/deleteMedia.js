/**
 * Deletes a media with the specified uuid
 *
 * @param {string} uuid UUID for the media to delete
 * @param {object} knex db instance
 * @returns {Promise}
 */
const deleteMedia = async (uuid, knex) => {
    const transaction = await knex.transaction()
    return knex('app_version_media')
        .transacting(transaction)
        .where('uuid', uuid)
        .del()
        .then(transaction.commit)
        .catch(transaction.rollback)
}

module.exports = deleteMedia
