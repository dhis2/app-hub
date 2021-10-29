/**
 * Fetches apps with a specified id, status and translations with a specific language
 *
 * @param {string} id id for the app to fetch
 * @param {string} status Filter the app on this status for example APPROVED, see enums/AppStatus
 * @param {string} languageCode language code for which language to use for the translations to fetch
 * @param {object} knex db instance (knex)
 * @returns {Promise<Array>}
 */
//eslint-disable-next-line max-params
const getAppsByIdAndStatus = (id, status, languageCode, knex) => {
    //TODO: add validation for parameters

    return knex('apps_view')
        .select()
        .where({
            app_id: id,
            status,
            language_code: languageCode,
        })
        .orderBy('version_created_at', 'desc')
}

module.exports = getAppsByIdAndStatus
