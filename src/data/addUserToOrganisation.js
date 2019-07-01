const joi = require('joi')

const paramsSchema = joi
    .object()
    .keys({
        userId: joi
            .number()
            .required()
            .min(1),
        organisationId: joi
            .number()
            .required()
            .min(1),
    })
    .options({ allowUnknown: true })

/**
 * Adds a user to an organisation
 *
 * @param {object} params
 * @param {Number} params.userId User id for the user
 * @param {Number} params.organisationId organisationId Organisation id which we want to add the user to
 * @param {*} knex db instance
 * @returns {Promise}
 */
const addUserToOrganisation = async (params, knex) => {
    const validation = joi.validate(params, paramsSchema)

    if (validation.error !== null) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const { userId, organisationId } = params

    const transaction = await knex.transaction()
    try {
        await knex
            .transacting(transaction)
            .insert({
                user_id: userId,
                organisation_id: organisationId,
            })
            .into('user_organisation')
        
        await transaction.commit()
    } catch (err) {
        throw new Error(
            `Could not add developer to organisation: ${userId} => ${organisationId}. ${
                err.message
            }`
        )
    }
}

module.exports = addUserToOrganisation
