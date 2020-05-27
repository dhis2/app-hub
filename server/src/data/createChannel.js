const debug = require('debug')('apphub:server:data:createChannel')

const joi = require('@hapi/joi')

const paramsSchema = joi
    .object()
    .keys({
        name: joi.string().required(),
    })
    .options({ allowUnknown: true })

/**
 * @typedef {object} CreateChannelResult
 * @property {number} id Database id of the created channel
 * @property {string} name Name of the created channel
 */

/**
 * Creates a channel and returns the database id
 *
 * @param {object} params
 * @param {string} params.name Name of the channel to create
 * @param {object} knex DB instance of knex, or transaction
 * @returns {Promise<CreateChannelResult>}
 */
const createChannel = async (params, knex) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        debug('validation error', validation.error)
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const { name } = params

    try {
        const [createdChannel] = await knex('channel')
            .insert({
                name,
            })
            .returning(['id', 'name'])

        debug('Created channel: ', createdChannel)

        return createdChannel
    } catch (err) {
        throw new Error(`Could not insert channel to database. ${err.message}`)
    }
}

module.exports = createChannel
