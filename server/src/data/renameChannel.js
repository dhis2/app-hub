const joi = require('joi')

const paramsSchema = joi
    .object()
    .keys({
        name: joi.string().required(),
        id: joi.string().uuid().required(),
    })
    .options({ allowUnknown: true })

/**
 * Edit the name of an release channel
 * @param {object} params
 * @param {string} params.name Name of the channel
 * @param {string} params.id id of the channel to edit
 * @param {object} knex DB instance or transaction
 */
const renameChannel = async (params, knex) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const { name, id } = params

    try {
        const [result] = await knex('channel')
            .where('id', id)
            .update({
                name,
            })
            .returning(['id', 'name'])

        return result
    } catch (error) {
        throw new Error(
            `Could not update channel: ${params.id}: ${params.name}. ${error.message}`
        )
    }
}

module.exports = renameChannel
