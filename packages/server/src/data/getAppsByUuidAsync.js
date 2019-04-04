

/**
 * Returns all apps from apps_view based on uuid and languageCode
 * @param {string} uuid
 * @param {string} languageCode
 * @param {*} dbConnection
 */
module.exports = async (uuid, languageCode, dbConnection) => {

    if ( !uuid ) {
        throw new Error(`Missing parameter 'uuid'`)
    }

    if ( !languageCode ) {
        throw new Error(`Missing parameter 'languageCode'`)
    }

    if ( !dbConnection ) {
        throw new Error(`Missing parameter 'dbConnection'`)
    }

    try {
        const apps = await dbConnection
            .select()
            .from('apps_view')
            .where({
                uuid,
                'language_code': languageCode
            })

        return apps
    } catch ( err ) {
        throw new Error(`Could not get apps with uuid: ${uuid} and languageCode: ${languageCode}`)
    }

}
