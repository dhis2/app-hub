const joi = require('joi')

const paramsSchema = joi.object().keys({
    userId: joi.number().required().min(1),
    organisationId: joi.number().required().min(1),
}).options({ allowUnknown: true })


/**
 * Adds a user to an organisation
 * @param {*} param
 * @param {number} param.userId User id for the user
 * @param {number} param.organisationId Organisation id to add the user to
 * @param {*} knex 
 * @param {*} transaction 
 */
const addUserToOrganisationAsync = async (params, knex, transaction) => {

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

    const { userId, organisationId } = params

    try {
        await knex.transacting(transaction)
            .insert({
                user_id: userId,
                organisation_id: organisationId
            })
            .into('user_organisation')

    } catch ( err ) {
        throw new Error(`Could not add developer to organisation: ${userId} => ${organisationId}. ${err.message}`)
    }

}

module.exports = addUserToOrganisationAsync
