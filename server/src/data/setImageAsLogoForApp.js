const joi = require('joi')
const { MediaType } = require('../enums')

const paramsSchema = joi.object().keys({
    appId: joi.string().uuid(),
    mediaId: joi.string().uuid(),
})

/**
 * Changes which media that is used as Logo for an app
 *
 * @param {object} params
 * @param {string} params.appId id of the app to set the logo for
 * @param {string} params.mediaId Media id to use as logo
 * @param {object} knex DB instance or transaction
 * @returns {Promise}
 */
const setImageAsLogoForApp = async (params, knex) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const { appId, mediaId } = params

    try {
        //Change all other media for this app to screenshot
        await knex('app_media')
            .where('app_id', appId)
            .update('media_type', MediaType.Screenshot)

        //Set the new as media_type logo
        await knex('app_media')
            .where('id', mediaId)
            .update('media_type', MediaType.Logo)
    } catch (err) {
        throw new Error(
            `Could not update logo for app: ${appId}.  Media id: ${mediaId}. ${err.message}`
        )
    }
}

module.exports = setImageAsLogoForApp
