const debug = require('debug')('apphub:data:updateAppVersion')

/**
 * Updates an appversion and its min/max versions for existing channels it's published to
 *
 * @param {object} params
 * @param {string} params.id id of the version to update
 * @param {number} params.userId The user id of the user making the change
 * @param {string} params.minDhisVersion Minimum inclusive required version of DHIS2 this version is compatible with
 * @param {string} params.maxDhisVersion Minimum inclusive required version of DHIS2 this version is compatible with
 * @param {string} params.version The version number of the appversion provided by the developer, for example v1.0, v1.2
 * @param {string} params.demoUrl The URL to the source code of the app, for example https://github.com/dhis2/app-hub
 * @param {string} params.changeSummary The change summary of the version to be created
 * @param {string} params.channel Name of the release channel to publish the app version to
 * @param {object} knex DB instance or transaction
 * @returns {Promise<CreateUserResult>}
 */
const updateAppVersion = async (params, knex) => {
    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const {
        id,
        userId,
        minDhisVersion,
        maxDhisVersion,
        version,
        demoUrl,
        changeSummary,
    } = params

    try {
        await knex('app_version')
            .update({
                demo_url: demoUrl,
                change_summary: changeSummary,
                version,
                updated_at: knex.fn.now(),
                updated_by_user_id: userId,
            })
            .where('id', id)

        const channelQuery = {}

        if (params.channel) {
            //Update channel id only if channel was passed
            const channel = await knex('channel')
                .select('id')
                .where('name', params.channel)
                .first('id')

            if (!channel) {
                throw new Error(`Channel ${params.channel} does not exist.`)
            }

            channelQuery.channel_id = channel.id
        }
        debug('channelQuery:', channelQuery)

        await knex('app_channel')
            .update({
                ...channelQuery,
                max_dhis2_version: maxDhisVersion,
                min_dhis2_version: minDhisVersion,
                updated_at: knex.fn.now(),
                updated_by_user_id: userId,
            })
            .where('app_version_id', id)
    } catch (err) {
        throw new Error(`Could not update appversion: ${id}. ${err.message}`)
    }
}

module.exports = updateAppVersion
