/**
 * Fetch an app based on its database id
 *
 * @param {number} appId id for the app to fetch
 * @param {number} languageCode language to fetch
 * @param {*} knex db instance
 * @param {Promise}
 */
const getAppById = async (appId, languageCode, knex) => {
    if (!appId) {
        throw new Error(`Missing parameter 'appId'`)
    }

    if (!languageCode) {
        throw new Error(`Missing parameter 'languageCode'`)
    }

    if (!knex) {
        throw new Error(`Missing parameter 'knex'`)
    }

    try {
        return await knex('apps_view')
            .select()
            .where({
                app_id: appId,
                language_code: languageCode,
            })
    } catch (err) {
        throw new Error(`Could not get app with id: ${appId}. ${err.message}`)
    }
}

module.exports = getAppById
