
/**
 * Returns all apps with translations on a specific language (if available)
 *
 * @param {string} languageCode 2 char language code for which language to return the apps with
 * @param {object} dbConnection db instance
 * @returns {Promise<Array>}
 */
const getAllAppsByLanguage = (languageCode, knex) => {

    if ( !languageCode ) {
        throw new Error('Missing/invalid paramter: languageCode')
    }

    if ( !knex ) {
        throw new Error('Missing parameter: knex')
    }

    return knex('apps_view')
        .select()
        .where({
            'language_code': languageCode
        })
}

module.exports = getAllAppsByLanguage

