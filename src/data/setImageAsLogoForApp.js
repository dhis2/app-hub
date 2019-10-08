const joi = require('@hapi/joi')
const { ImageType } = require('../enums')

const paramsSchema = joi.object().keys({
    appUuid: joi.string().uuid(),
    mediaUuid: joi.string().uuid(),
})

/**
 * Changes which media that is used as Logo for an app
 *
 * @param {object} params
 * @param {string} params.appUuid UUID of the app to set the logo for
 * @param {string} params.mediaUuid Media UUID to use as logo
 * @param {*} knex
 * @returns {Promise}
 */
const setImageAsLogoForApp = async (params, knex, transaction) => {
    const validation = joi.validate(params, paramsSchema)

    if (validation.error !== null) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    if (!transaction) {
        throw new Error('No transaction passed to function')
    }

    const { appUuid, mediaUuid } = params

    try {
        const appVersionIds = await knex('app_version')
            .innerJoin('app', 'app.id', 'app_version.app_id')
            .select('app_version.id')
            .where('app.uuid', appUuid)
            .pluck('app_version.id')

        //Change all other media for this pap to screenshot
        await knex('app_version_media')
            .transacting(transaction)
            .whereIn('app_version_id', appVersionIds)
            .update('image_type', ImageType.Screenshot)

        //Set the new as image_type logo
        await knex('app_version_media')
            .transacting(transaction)
            .where('uuid', mediaUuid)
            .update('image_type', ImageType.Logo)
    } catch (err) {
        throw new Error(
            `Could not update logo for app: ${appUuid}.  Media uuid: ${mediaUuid}. ${err.message}`
        )
    }
}

module.exports = setImageAsLogoForApp
