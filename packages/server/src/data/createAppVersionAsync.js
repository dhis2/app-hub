const uuid = require('uuid/v4')

module.exports = async (currentUserId, appId, demoUrl, sourceUrl, appVersionNumber, knex, transaction) => {

    const versionUUID = uuid()

    const insertedId = await knex('app_version')
        .transacting(transaction)
        .insert({
            app_id: appId,
            created_at: knex.fn.now(),
            created_by_user_id: currentUserId,
            uuid: versionUUID,
            demo_url: demoUrl,
            source_url: sourceUrl,
            version: appVersionNumber
        }).returning('id')

    if ( !insertedId || insertedId[0] <= 0 ) {
        throw new Error(`Could not create appversion for appid: ${appId}, ${currentUserId}, ${demoUrl}, ${sourceUrl}, ${appVersionNumber}`)
    }

    return { 
        uuid: versionUUID, 
        id: insertedId[0],
    }

}