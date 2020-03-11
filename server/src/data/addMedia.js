const joi = require('@hapi/joi')

const { ImageTypes } = require('../enums')

const paramSchema = joi
    .object()
    .keys({
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
    })
    .options({ allowUnknown: true })

/**
 * @typedef {object} AddMediaResult
 * @property {string} uuid The generated id for the created media
 */

/**
 * Publish an app version to a channel
 *
 * @param {object} params The parameters used for saving a media
 * @param {number} params.userId The id for the user which uploaded the media ("created by user id")
 * @param {string} params.fileName Original filename as when uploaded
 * @param {string} params.mime MIME type for the file, for example 'image/jpeg'
 * @param {object} knex DB instance of knex
 * @returns {Promise<AddMediaResult>}
 */
const addMedia = async (params, knex, transaction) => {
    const validation = paramSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!transaction) {
        throw new Error('No transaction passed to function')
    }

    const { userId, fileName, mime } = params
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
            original_filename: fileName,
            created_at: knex.fn.now(),
            created_by_user_id: userId,
        }

        const [id] = await knex('media')
            .transacting(transaction)
            .insert(insertData)
            .returning('id')

        return { id }
    } catch (err) {
        // remove created_at otherwise we'll get a circular reference in the stringify-serialisation
        throw new Error(
            `Could not add media: ${JSON.stringify({
                ...insertData,
                created_at: null,
            })}. ${err.message}`
        )
    }
}

module.exports = addMedia
