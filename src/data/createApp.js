const uuid = require('uuid/v4')

const joi = require('@hapi/joi')

const { AppTypes } = require('../enums')

const paramsSchema = joi
    .object()
    .keys({
        userId: joi.number().required(),
        developerUserId: joi.number().required(),
        orgId: joi.number().required(),
        appType: joi
            .string()
            .required()
            .valid(...AppTypes),
    })
    .options({ allowUnknown: true })

/**
 * @typedef {object} CreateAppResult
 * @property {number} id Database id of the created app
 * @property {string} uuid The generated UUID for the created app
 */

/**
 * Creates an app and returns the database id
 *
 * @param {object} params
 * @param {number} params.userId User id creating the app (admin, manager, api user making the actual upload)
 * @param {number} params.developerUserId User id for the developer of the app
 * @param {number} params.orgId Organisation id for the organisation owning this app
 * @param {string} params.appType Type of the app
 * @param {object} knex
 * @returns {Promise<CreateAppResult>}
 */
const createApp = async (params, knex, transaction) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!transaction) {
        throw new Error('No transaction passed to function')
    }

    const { userId, developerUserId, orgId, appType } = params

    //generate a new uuid to insert
    const appUuid = uuid()

    try {
        const [id] = await knex('app')
            .transacting(transaction)
            .insert({
                created_at: knex.fn.now(),
                created_by_user_id: userId,
                developer_user_id: developerUserId,
                organisation_id: orgId,
                type: appType,
                uuid: appUuid,
            })
            .returning('id')

        if (id < 0) {
            throw new Error('Inserted id was < 0')
        }

        return { id, uuid: appUuid }
    } catch (err) {
        throw new Error(`Could not insert app to database. ${err.message}`)
    }
}

module.exports = createApp
