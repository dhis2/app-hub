const joi = require('joi')

const schema = joi.object({
    id: joi
        .string()
        .uuid()
        .required(),
})

/**
 * Finds an organisation by one of the optional parameters. If passing multiple they will be evaluated in the following order: id, uuid, name
 *
 * @param {string} id id for the organisation to get
 * @param {*} knex db instance
 * @returns {Promise<object>}
 */
const getOrganisationById = async (id, knex) => {
    if (!knex) {
        throw new Error(`Missing knex instance passed as parameter.`)
    }

    const validation = schema.validate({ id })
    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    try {
        const [organisation] = await knex('organisation')
            .select()
            .where('id', id)
        return organisation
    } catch (err) {
        throw new Error(
            `Could not fetch organisation by id ${id}, ${err.message}.`
        )
    }
}

module.exports = getOrganisationById
