const joi = require('joi')

const { MediaTypes } = require('../enums')

const paramSchema = joi
    .object()
    .keys({
        appId: joi.string().uuid().required(),
        userId: joi.string().uuid().required(),
        mediaType: joi
            .number()
            .required()
            .valid(...MediaTypes),
        fileName: joi.string().required().max(255),
        mime: joi.string().required().max(255),
    })
    .options({ allowUnknown: true })

/**
 * @typedef {object} AppMediaResult
 * @property {string} id The generated uuid for the created media
 */

/**
 * Save/connect a media item to an app
 *
 * @param {object} params The parameters used to publish an app version to a specific channel
 * @param {number} params.appId The app version db id this media belongs to
 * @param {number} params.userId The id for the user which uploaded the media ("created by user id")
 * @param {number} params.mediaType MediaType enum that determines if this is a logotype or image/screenshot
 * @param {string} params.fileName Original filename as when uploaded
 * @param {string} params.mime MIME type for the file, for example 'image/jpeg'
 * @param {object} knex DB instance of knex, or transaction
 * @returns {Promise<AppMediaResult>}
 */
const addAppMedia = async (params, knex) => {
    const validation = paramSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('No db passed to function')
    }

    const { appId, userId, mediaType, fileName, mime } = params
    let insertData = null

    try {
        let mimeTypeId = null
        const mimeTypes = await knex('mime_type')
            .select('id')
            .where('mime', mime)

        if (!mimeTypes || mimeTypes.length === 0) {
            const [{ id }] = await knex('mime_type')
                .insert({
                    mime,
                })
                .returning('id')

            mimeTypeId = id
        } else {
            mimeTypeId = mimeTypes[0].id
        }

        if (mimeTypeId === null) {
            throw new Error(
                `Something went wrong when trying to get mediaTypeId for ${mime}`
            )
        }

        const mediaToInsert = {
            mime_type_id: mimeTypeId,
            original_filename: fileName,
            created_at: knex.fn.now(),
            created_by_user_id: userId,
        }

        const [{ mediaId }] = await knex('media')
            .insert(mediaToInsert)
            .returning('id')

        insertData = {
            media_type: mediaType,
            created_at: knex.fn.now(),
            created_by_user_id: userId,
            app_id: appId,
            media_id: mediaId,
        }

        const [{ id }] = await knex('app_media')
            .insert(insertData)
            .returning('id')

        return { id, media_id: mediaId }
    } catch (err) {
        // remove created_at otherwise we'll get a circular reference in the stringify-serialisation
        throw new Error(
            `Could not add media to app version: ${JSON.stringify({
                ...insertData,
                created_at: null,
            })}. ${err.message}`
        )
    }
}

module.exports = addAppMedia
