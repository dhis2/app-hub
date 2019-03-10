'use strict'

/**
 * Returns all apps from apps_view based on uuid and languageCode
 * @param {*} uuid
 * @param {*} languageCode
 * @param {*} dbConnection
 */
module.exports = (uuid, languageCode, dbConnection) => {

    if ( !uuid ) {
        throw new Error(`Missing parameter 'uuid'`)
    }

    if ( !languageCode ) {
        throw new Error(`Missing parameter 'languageCode'`)
    }

    if ( !dbConnection ) {
        throw new Error(`Missing parameter 'dbConnection'`)
    }

    return dbConnection
        .select()
        .from('apps_view')
        .where({
            uuid,
            'language_code': languageCode
        })
}
