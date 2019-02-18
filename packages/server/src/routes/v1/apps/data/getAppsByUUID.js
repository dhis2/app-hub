module.exports = async (uuid, status, languageCode, dbConnection)  => {
    return await dbConnection
                .select()
                .from('apps_view')
                .where({
                    'uuid': uuid,
                    'status': status,
                    'language_code': languageCode
                })
}