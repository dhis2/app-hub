

/**
 * Fetches apps with a specified uuid, status and translations with a specific language
 * @function getAppsByUuidAndStatus
 * @param {string} uuid UUID for the app to fetch
 * @param {string} status Filter the app on this status for example APPROVED, see enums/AppStatus
 * @param {string} languageCode language code for which language to use for the translations to fetch
 * @param {object} dbConnection db instance (knex)
 * @returns {Promise<Array>}
 */
module.exports = (uuid, status, languageCode, dbConnection) => {

    //TODO: add validation for parameters

    return dbConnection
        .select()
        .from('apps_view')
        .where({
            uuid,
            status,
            'language_code': languageCode
        })
}
