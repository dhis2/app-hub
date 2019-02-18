module.exports = async (languageCode, dbConnection)  => {
    return await dbConnection
                .select()
                .from('apps_view')
                .where({
                    'language_code': languageCode
                })
}