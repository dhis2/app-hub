const joi = require('@hapi/joi')

const paramsSchema = joi
    .object()
    .keys({
        name: joi.string().required(),
        newName: joi.string().required(),
    })
    .options({ allowUnknown: true })

/**
 * Edit the name of an release channel
 * @param {object} params
 * @param {string} params.name Name of the channel to edit
 * @param {string} params.newName New name of the channel
 * @param {object} knex
 * @param {object} transaction
 */
const renameChannel = async (params, knex, transaction) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const { name, newName } = params

    try {
        const [result] = await knex('channel')
            .transacting(transaction)
            .where('name', name)
            .update({
                name: newName,
            })
            .returning(['id', 'uuid', 'name'])

        return result
    } catch (error) {
        throw new Error(
            `Could not update channel: ${params.name} to ${params.newName}. ${error.message}`
        )
    }
}

module.exports = renameChannel
