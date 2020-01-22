const joi = require('@hapi/joi')
const uuid = require('uuid/v4')

const { ImageTypes } = require('../enums')

const paramSchema = joi
    .object()
    .keys({
        appVersionId: joi
            .string()
            .uuid()
            .required(),
        userId: joi
            .string()
            .uuid()
            .required(),
        imageType: joi
            .number()
            .required()
            .valid(...ImageTypes),
        fileName: joi
            .string()
            .required()
            .max(255),
        mime: joi
            .string()
            .required()
            .max(255),
        caption: joi.string().allow('', null),
        description: joi.string().allow('', null),
    })
    .options({ allowUnknown: true })

/**
 * @typedef {object} AppVersionMediaResult
 * @property {number} id Database id for the inserted media
 * @property {string} uuid The generated uuid for the created media
 */

/**
 * Publish an app version to a channel
 *
 * @param {object} params The parameters used to publish an app version to a specific channel
 * @param {number} params.appVersionId The app version db id this media belongs to
 * @param {number} params.userId The id for the user which uploaded the media ("created by user id")
 * @param {number} params.imageType ImageType enum that determines if this is a logotype or image/screenshot
 * @param {string} params.fileName Original filename as when uploaded
 * @param {string} params.mime MIME type for the file, for example 'image/jpeg'
 * @param {string} params.caption caption/title of the media
 * @param {string} params.description description of the media
 * @param {object} knex DB instance of knex
 * @returns {Promise<AppVersionMediaResult>}
 */
const addAppVersionMedia = async (params, knex, transaction) => {
    const validation = paramSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!transaction) {
        throw new Error('No transaction passed to function')
    }

    const {
        appVersionId,
        userId,
        imageType,
        fileName,
        mime,
        caption,
        description,
    } = params
    let insertData = null

    try {
        let mediaTypeId = null
        const mediaTypes = await knex('media_type')
            .select('id')
            .where('mime', mime)

        if (!mediaTypes || mediaTypes.length === 0) {
            const [id] = await knex('media_type')
                .transacting(transaction)
                .insert({
                    mime,
                })
                .returning('id')

            mediaTypeId = id
        } else {
            mediaTypeId = mediaTypes[0].id
        }

        if (mediaTypeId === null) {
            throw new Error(
                `Something went wrong when trying to get mediaTypeId for ${mime}`
            )
        }

        insertData = {
            image_type: imageType,
            original_filename: fileName,
            created_at: knex.fn.now(),
            created_by_user_id: userId,
            media_type_id: mediaTypeId,
            app_version_id: appVersionId,
            caption: caption,
            description: description,
        }

        const [id] = await knex('app_version_media')
            .transacting(transaction)
            .insert(insertData)
            .returning('id')

        return { id }
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

module.exports = addAppVersionMedia
