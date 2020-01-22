const joi = require('@hapi/joi')

const paramsSchema = joi
    .object()
    .keys({
        userId: joi
            .string()
            .uuid()
            .required(),
        organisationId: joi
            .string()
            .uuid()
            .required(),
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
const addUserToOrganisation = async (params, knex, transaction) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    if (!transaction) {
        throw new Error('No transaction passed to function')
    }

    const { userId, organisationId } = params

    try {
        await knex
            .transacting(transaction)
            .insert({
                user_id: userId,
                organisation_id: organisationId,
            })
            .into('user_organisation')
    } catch (err) {
        throw new Error(
            `Could not add developer to organisation: ${userId} => ${organisationId}. ${err.message}`
        )
    }
}

module.exports = addUserToOrganisation
