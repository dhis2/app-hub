/**
 * Returns all apps based on specified filter params such as status, languageCode and channel
 * @param {object} params
 * @param {string} params.status Which status to get the apps for, example APPROVED AppTypes in src/enum
 * @param {string} params.languageCode The language code for which language to use when fetching translations
 * @param {string} params.channel Name of the channel to filter apps by, for example Stable, Development, Canary is commonly used
 * @returns {Promise<Array>}
 *
 */
const getApps = ({ status, languageCode, channel } = params, knex) => {
    const filter = {
        status,
        language_code: languageCode,
    }

    //optional channel
    if (channel) {
        filter.channel_name = channel
    }

    return knex('apps_view')
        .select()
        .where(filter)
}

module.exports = getApps
