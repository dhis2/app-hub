const joi = require('@hapi/joi')

const schema = joi.object({
    id: joi.number(),
})

/**
 * Finds all organisations the user is a member of, including other users of the organisation
 *
 * @param {string} id id of the user
 * @param {*} knex db instance
 * @returns {Promise<object>}
 */
const getOrganisationsByUserId = async (id, knex) => {
    if (!knex) {
        throw new Error(`Missing knex instance passed as parameter.`)
    }

    const validation = schema.validate({ id })
    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    try {
        const userOrganisations = knex('user_organisation')
            .select('organisation_id')
            .where('user_id', id)
        const organsations = await knex('users_with_organisations')
            .select()
            .whereIn('user_id', userOrganisations)
        return organsations
    } catch (err) {
        throw new Error(
            `Could not fetch organisation by uuid ${id}, ${err.message}.`
        )
    }
}

module.exports = getOrganisationsByUserId
