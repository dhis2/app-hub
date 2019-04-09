

/**
 * Deletes an app with the specified uuid
 * @function deleteApp
 * @param {string} uuid UUID for the app to delete
 * @returns {Promise}
 */
module.exports = (uuid, knex) => {

    return knex('app').where('uuid', uuid).del()
}
