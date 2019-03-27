const uuid = require('uuid/v4')

const joi = require('joi')

const { AppType } = require('@enum')

const paramsSchema = joi.object().keys({
    userId: joi.number().required(),
    orgId: joi.number().required(),
    appType: joi.string().required.valid(AppType),
}).options({ allowUnknown: true })


/**
 * Creates an app and returns the database id
 * @param {number} userId
 * @param {number} orgId
 * @param {*} appType
 * @param {object} knex
 * @param {object} transaction
 */
const createAppAsync = async (params, knex, transaction) =>  {

    const validation = joi.validate(params, paramsSchema)

    if ( validation.error !== null ) {
        throw new Error(validation.error)
    }

    const { userId, orgId, appType } = params


    //generate a new uuid to insert
    const appUuid = uuid()

    try {
        const [id] = await knex('app')
            .transacting(transaction)
            .insert({
                created_at: knex.fn.now(),
                created_by_user_id: userId,
                organisation_id: orgId,
                type: appType,
                uuid: appUuid
            }).returning('id')

        if ( id < 0 ) {
            throw new Error('Inserted id was < 0')
        }

        return { id, uuid: appUuid }
    } catch ( err ) {
        throw new Error(`Could not insert app to database. ${err.message}`)
    }
}


module.exports = createAppAsync
