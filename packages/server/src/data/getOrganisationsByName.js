const joi = require('joi')

/**
 * Finds an organisation by one of the optional parameters. If passing multiple they will be evaluated in the following order: id, uuid, name
 *
 * @param {string} name Name of the organisation to get
 * @param {*} knex db instance
 * @returns {Array<Organisation>} The organisations found by name or empty array if no matches
 */
const getOrganisationsByName = async (name, knex) => {
    if (!knex) {
        throw new Error(`Missing knex instance passed as parameter.`)
    }

    const validation = joi.validate({ name }, { name: joi.string().required() })
    if (validation.error !== null) {
        throw new Error(validation.error)
    }

    try {
        const organisations = await knex('organisation')
            .select()
            .where('name', name)
        return organisations || []
    } catch (err) {
        throw new Error(
            `Could not fetch organisation by name ${name}, ${err.message}.`
        )
    }
}

module.exports = getOrganisationsByName
