
const joi = require('joi')
const uuid = require('uuid/v4')

const { ImageTypes } = require('@enums')

const paramSchema = joi.object().keys({
    appVersionId: joi.number().required().min(1),
    userId: joi.number().required().min(1),
    imageType: joi.number().required().valid(ImageTypes),
    fileName: joi.string().required().max(255),
    mime: joi.string().required().max(255)
}).options({ allowUnknown: true })

/**
 * Publish an app version to a channel
 * @param {object} params The parameters used to publish an app version to a specific channel
 * @param {number} params.appVersionId The app version db id this media belongs to
 * @param {number} params.userId The id for the user which uploaded the media ("created by user id")
 * @param {number} params.imageType MediaType enum that determines if this is a logotype or image/screenshot
 * @param {string} params.fileName MediaType enum that determines if this is a logotype or image/screenshot
 * @param {string} params.mediaType MediaType enum that determines if this is a logotype or image/screenshot
 * @param {object} knex DB instance of knex
 * @param {object} trx The transaction to operate on
 */
const addAppVersionMediaAsync = async (params, knex, transaction) => {

    const validation = paramSchema.validate(params)

    if ( validation.error !== null ) {
        throw new Error(validation.error)
    }

    const { appVersionId, userId, imageType, fileName, mime } = params
    let insertData = null

    try {
        let mediaTypeId = null
        const mediaTypes = await knex('media_type').select('id').where('mime', mime)
        if ( !mediaTypes || mediaTypes.length === 0 ) {
            const [id] = await knex('media_type')
                .transacting(transaction)
                .insert({
                    mime
                }).returning('id')

            mediaTypeId = id
        } else {
            mediaTypeId = mediaTypes[0].id
        }

        if ( mediaTypeId === null ) {
            throw new Error(`Something went wrong when trying to get mediaTypeId for ${mime}`)
        }

        const mediaUuid = uuid();

        insertData = {
            uuid: mediaUuid,
            image_type: imageType,
            original_filename: fileName,
            created_at: knex.fn.now(),
            created_by_user_id: userId,
            media_type_id: mediaTypeId,
            app_version_id: appVersionId
        }        

        const [id] = await knex('app_version_media')
            .transacting(transaction)
            .insert(insertData)
            .returning('id')

        return { id, uuid: mediaUuid }

    } catch ( err ) {
        throw new Error(`Could not add media to app version: ${JSON.stringify(insertData)}. ` + err.message)
    }
}

module.exports = addAppVersionMediaAsync
