'use strict'

module.exports = (uuid, status, languageCode, dbConnection) => {

    return dbConnection
        .select()
        .from('apps_view')
        .where({
            uuid,
            status,
            'language_code': languageCode
        })
}
