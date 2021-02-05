const debug = require('debug')('apphub:server:data:getApps')

/**
 * Returns all apps based on specified filter params such as status, languageCode and channel
 * @param {object} params
 * @param {string} params.status Which status to get the apps for, example APPROVED AppTypes in src/enum
 * @param {string} params.languageCode The language code for which language to use when fetching translations
 * @param {array} params.channels Channels to filter apps by, for example Stable, Development, Canary is commonly used
 * @param {array} params.types Types to filter apps by
 * @param {string} params.query Search query for app names
 * @returns {Promise<Array>}
 */
const getApps = (
    { status, languageCode, channels = [], types = [], query },
    knex
) => {
    debug('status:', status)
    debug('languageCode:', languageCode)
    debug('channels:', channels)

    return knex('apps_view')
        .select()
        .where(builder => {
            builder.where('status', status)
            builder.where('language_code', languageCode)

            if (channels.length > 0) {
                builder.where(builder => {
                    builder.where('channel_name', channels[0])
                    channels.slice(1).forEach(channel => {
                        builder.orWhere('channel_name', channel)
                    })
                })
            }

            if (types.length > 0) {
                builder.where(builder => {
                    builder.where('type', types[0])
                    types.slice(1).forEach(type => {
                        builder.orWhere('type', type)
                    })
                })
            }

            if (query) {
                builder.where(builder => {
                    builder.where('name', 'ilike', `%${query}%`)
                    builder.orWhere('organisation', 'ilike', `%${query}%`)
                })
            }
        })
}

module.exports = getApps
