

/**
 * Returns all apps based on status with translations on the specified language
 * @function getAppsByStatusAndLanguage
 * @param {string} status Which status to get the apps for, example APPROVED AppTypes in src/enum
 * @param {string} languageCode The language code for which language to use when fetching translations
 * @returns {Promise<Array>}
 * 
 */
module.exports = (status, languageCode, dbConnection) => {

    return dbConnection
        .select()
        .from('apps_view')
        .where({
            status,
            'language_code': languageCode
        })
}
