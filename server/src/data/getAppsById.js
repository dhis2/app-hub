/**
 * Returns all apps from apps_view based on uuid and languageCode
 *
 * @param {string} id id for the apps to fetch (apps_view will match multiple rows on same UUID based on how many versions there are)
 * @param {string} languageCode language code for which language to fetch the translations on
 * @param {*} knex db instance
 * @param {Promise<Array>}
 */
const getAppsById = async (id, languageCode, knex) => {
    if (!id) {
        throw new Error(`Missing parameter 'id'`)
    }

    if (!languageCode) {
        throw new Error(`Missing parameter 'languageCode'`)
    }

    if (!knex) {
        throw new Error(`Missing parameter 'knex'`)
    }

    try {
        const apps = await knex('apps_view')
            .select()
            .where({
                app_id: id,
                language_code: languageCode,
            })
            .orderBy('version_created_at', 'desc')

        return apps
    } catch (err) {
        throw new Error(
            `Could not get apps with id: ${id} and languageCode: ${languageCode}`
        )
    }
}

module.exports = getAppsById
