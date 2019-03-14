

module.exports = (status, languageCode, dbConnection) => {

    return dbConnection
        .select()
        .from('apps_view')
        .where({
            status,
            'language_code': languageCode
        })
}
