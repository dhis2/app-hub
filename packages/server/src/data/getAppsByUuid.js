

/**
 * Returns all apps from apps_view based on uuid and languageCode
 *
 * @param {string} uuid UUID for the apps to fetch (apps_view will match multiple rows on same UUID based on how many versions there are)
 * @param {string} languageCode language code for which language to fetch the translations on
 * @param {*} knex db instance
 * @param {Promise<Array>}
 */
const getAppsByUuid = async (uuid, languageCode, knex) => {

    if ( !uuid ) {
        throw new Error(`Missing parameter 'uuid'`)
    }

    if ( !languageCode ) {
        throw new Error(`Missing parameter 'languageCode'`)
    }

    if ( !knex ) {
        throw new Error(`Missing parameter 'knex'`)
    }

    try {
        const apps = await knex('apps_view')
            .select()
            .where({
                uuid,
                'language_code': languageCode
            })

        return apps
    } catch ( err ) {
        throw new Error(`Could not get apps with uuid: ${uuid} and languageCode: ${languageCode}`)
    }
}

module.exports = getAppsByUuid

