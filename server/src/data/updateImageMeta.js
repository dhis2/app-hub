const joi = require('@hapi/joi')

const paramsSchema = joi.object().keys({
    uuid: joi.string().uuid(),
    caption: joi.string().allow('', null),
    description: joi.string().allow('', null),
})

/**
 * Update meta for an image
 * @param {object} params
 * @param {string} params.uuid UUID of the image to update
 * @param {string} params.caption Caption of the image
 * @param {string} params.description Description of the image
 * @param {*} knex
 * @returns {Promise}
 */
const updateImageMeta = async (params, knex, transaction) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const { uuid, caption, description } = params

    try {
        await knex('app_version_media')
            .transacting(transaction)
            .where('uuid', uuid)
            .update({
                caption,
                description,
            })
    } catch (err) {
        throw new Error(`Could not update media meta: ${uuid}. ${err.message}`)
    }
}

module.exports = updateImageMeta
