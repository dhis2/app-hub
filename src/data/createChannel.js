const uuid = require('uuid/v4')

const joi = require('joi')

const paramsSchema = joi
    .object()
    .keys({
        name: joi.string().required(),
    })
    .options({ allowUnknown: true })

/**
 * @typedef {object} CreateChannelResult
 * @property {number} id Database id of the created channel
 * @property {string} uuid The generated UUID for the created channel
 */

/**
 * Creates a channel and returns the database id
 *
 * @param {object} params
 * @param {string} params.name Name of the release channel
 * @param {object} knex
 * @returns {Promise<CreateChannelResult>}
 */
const createChannel = async (params, knex) => {
    const validation = joi.validate(params, paramsSchema)

    if (validation.error !== null) {
        console.error(validation.error)
        throw new Error(validation.error)
    }

    const { name } = params

    //generate a new uuid to insert
    const channelUuid = uuid()

    const transaction = await knex.transaction()
    try {
        const [id] = await knex('channel')
            .transacting(transaction)
            .insert({
                uuid: channelUuid,
                name,
            })
            .returning('id')

        if (id < 0) {
            throw new Error('Inserted id was < 0')
        }

        await transaction.commit()
        return { id, uuid: channelUuid }
    } catch (err) {
        await transaction.rollback()
        throw new Error(`Could not insert channel to database. ${err.message}`)
    }
}

module.exports = createChannel
