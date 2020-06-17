const joi = require('@hapi/joi')
const slugify = require('slugify')

const paramsSchema = joi.object().keys({
    userId: joi.string().uuid(),
    name: joi
        .string()
        .min(1)
        .max(100),
})

/**
 * An organisation developing apps in the app hub
 * @typedef {object} Organisation
 * @property {string} id The organisation id
 * @property {string} name Name of the organisation
 * @property {string} slug The slugified name in lowercase
 */

/**
 * Create a new organisation with the specified name
 *
 * @param {object} params
 * @param {number} params.userId The userId of the user thats creating the organisation
 * @param {string} params.name Name of the company to create (1-100 chars)
 * @param {object} knex DB instance of knex, or transaction
 * @returns {Promise<Organisation>} The created organisation
 */
const createOrganisation = async (params, knex) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error(`Missing parameter: knex`)
    }

    const { userId, name } = params
    const originalSlug = slugify(name, { lower: true })
    let slug = originalSlug

    try {
        let slugUniqueness = 2
        let foundUniqueSlug = false
        while (!foundUniqueSlug) {
            const [{ count }] = await knex('organisation')
                .count('id')
                .where('slug', slug)
            if (count > 0) {
                slug = `${originalSlug}-${slugUniqueness}`
                slugUniqueness++
            } else {
                foundUniqueSlug = true
            }
        }
        const [id] = await knex('organisation')
            .insert({
                created_at: knex.fn.now(),
                created_by_user_id: userId,
                name,
                slug,
            })
            .returning('id')
        return { id, name, slug }
    } catch (err) {
        throw new Error(`Could not create organisation: ${err.message}`)
    }
}

module.exports = createOrganisation
