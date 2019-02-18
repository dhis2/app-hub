module.exports = async (status, languageCode, dbConnection)  => {
    return await dbConnection
                .select()
                .from('apps_view')
                .where({
                    'status': status,
                    'language_code': languageCode
                })
}