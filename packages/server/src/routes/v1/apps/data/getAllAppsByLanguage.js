'use strict'

module.exports = (languageCode, dbConnection) => {

    return dbConnection
        .select()
        .from('apps_view')
        .where({
            'language_code': languageCode
        })
}
