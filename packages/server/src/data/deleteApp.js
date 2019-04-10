

/**
 * Deletes an app with the specified uuid
 *
 * @param {string} uuid UUID for the app to delete
 * @returns {Promise}
 */
module.exports.deleteApp = (uuid, knex) => {

    return knex('app').where('uuid', uuid).del()
}
