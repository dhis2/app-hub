const joi = require('joi')

const paramsSchema = joi.object().keys({
    id: joi.string().uuid(),
    caption: joi.string().allow('', null),
    description: joi.string().allow('', null),
})

/**
 * Update meta for an image
 * @param {object} params
 * @param {string} params.id UUID of the image to update
 * @param {string} params.caption Caption of the image
 * @param {string} params.description Description of the image
 * @param {object} knex DB instance or transaction
 * @returns {Promise}
 */
const updateImageMeta = async (params, knex) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const { id, caption, description } = params

    try {
        await knex('media').where('id', id).update({
            caption,
            description,
        })
    } catch (err) {
        throw new Error(`Could not update media meta: ${id}. ${err.message}`)
    }
}

module.exports = updateImageMeta
