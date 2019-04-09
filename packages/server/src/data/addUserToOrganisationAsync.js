const joi = require('joi')

const paramsSchema = joi.object().keys({
    userId: joi.number().required().min(1),
    organisationId: joi.number().required().min(1),
}).options({ allowUnknown: true })


/**
 * Adds a user to an organisation
 * @function addUserToOrganisation
 * @param {object} params
 * @param {Number} params.userId User id for the user
 * @param {Number} params.organisationId organisationId Organisation id which we want to add the user to
 * @param {*} knex db instance
 * @param {*} transaction knex transaction
 * @returns {Promise}
 */
module.exports = async (params, knex, transaction) => {

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
