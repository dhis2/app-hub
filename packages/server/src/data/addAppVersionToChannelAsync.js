


/**
 * 
 * @param {*} appVersionId
 * @param {*} currentUserId
 * @param {any}
 * @param {*} minDhisVersion
 * @param {*} maxDhisVersion
 * @param {*} knex
 * @param {*} trx
 */
const addAppVersionToChannelAsync = async (appVersionId, currentUserId, channelName, minDhisVersion, maxDhisVersion, knex, transaction) => {

    try {
        const [id] = await knex('app_channel')
            .transacting(transaction)
            .insert({
                app_version_id: appVersionId,
                channel_id: 1, //TODO: set dynamically
                created_at: knex.fn.now(),
                created_by_user_id: currentUserId,
                min_dhis2_version: minDhisVersion,
                max_dhis2_version: maxDhisVersion
            }).returning('id')

        if ( id < 0 ) {
            throw new Error('Inserted id was < 0')
        }

        return { id }

    } catch ( err ) {
        throw new Error(`Could not add app version with id ${appVersionId} to channel ${channelName}. ${err.message}`)
    }
}


module.exports = addAppVersionToChannelAsync
