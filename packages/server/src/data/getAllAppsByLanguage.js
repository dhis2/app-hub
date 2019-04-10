
/**
 * Returns all apps with translations on a specific language (if available)
 *
 * @param {string} languageCode 2 char language code for which language to return the apps with
 * @param {object} dbConnection db instance
 * @returns {Promise<Array>}
 */
const getAllAppsByLanguage = (languageCode, dbConnection) => {

    return dbConnection
        .select()
        .from('apps_view')
        .where({
            'language_code': languageCode
        })
}

module.exports = getAllAppsByLanguage

