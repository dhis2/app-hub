const uuid = require('uuid/v4')

module.exports = async (currentUserId, appId, demoUrl, sourceUrl, appVersionNumber, knex, transaction) => {

    const versionUuid = uuid()

    try {
        const [id] = await knex('app_version')
            .transacting(transaction)
            .insert({
                app_id: appId,
                created_at: knex.fn.now(),
                created_by_user_id: currentUserId,
                uuid: versionUuid,
                demo_url: demoUrl,
                source_url: sourceUrl,
                version: appVersionNumber
            }).returning('id')

        if ( id < 0 ) {
            throw new Error('Inserted id was < 0')
        }

        return { id, uuid: versionUuid }
    } catch ( err ) {
        throw new Error(`Could not create appversion for appid: ${appId}, ${currentUserId}, ${demoUrl}, ${sourceUrl}, ${appVersionNumber}. ${err.message}`)
    }
}