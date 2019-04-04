const uuid = require('uuid/v4')
const joi = require('joi')

const paramsSchema = joi.object().keys({
    email: joi.string().email().required(),
    name: joi.string()
}).options({ allowUnknown: true })

/**
 * Creates a new user 
 * @param {object} params 
 * @param {string} params.email The users email
 * @param {string} params.name The name of the user 
 * @param {*} knex 
 * @param {*} transaction 
 */
const createUserAsync = async (params, knex, transaction) => {

    const validation = joi.validate(params, paramsSchema)

    if ( validation.error !== null ) {
        throw new Error(validation.error)
    }

    if ( !knex ) {
        throw new Error('Missing parameter: knex')
    }

    if ( !transaction ) {
        throw new Error('Missing parameter: transaction')
    }

    const { email, name } = params
    const newUuid = uuid()

    try {
        const [id] = await knex
            .transacting(transaction)
            .insert({
                email,
                name,
                uuid: newUuid,
                created_at: knex.fn.now()
            })
            .into('users')
            .returning('id')

        return { id, email, uuid: newUuid, name }

    } catch ( err ) {
        throw new Error(`Could not create user: ${params.email}. ${err.message}`)
    }
}


module.exports = createUserAsync
