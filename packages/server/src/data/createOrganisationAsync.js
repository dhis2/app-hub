const joi = require('joi')
const slugify = require('slugify')
const uuid = require('uuid/v4')

const paramsSchema = joi.object().keys({
    userId: joi.number().required(),
    name: joi.string().min(1).max(100)
})

/**
 * An organisation developing apps in the app store
 * @typedef {object} Organisation
 * @property {number} id The internal database id
 * @property {string} uuid A unique "public" id
 * @property {string} name Name of the organisation
 * @property {string} slug The slugified name in lowercase
 */

/**
 * Create a new organisation with the specified name
 * @param {object} params
 * @param {number} params.userId The userId of the user thats creating the organisation
 * @param {string} params.name Name of the company to create (1-100 chars)
 * @param {*} knex
 * @param {*} transaction
 * @returns {Organisation} The created organisation
 */
const createOrganisationAsync = async (params, knex, transaction) => {

    const validation = joi.validate(params, paramsSchema)

    if ( validation.error !== null ) {
        throw new Error(validation.error)
    }

    if ( !knex ) {
        throw new Error(`Missing parameter: knex`)
    }

    const { userId, name } = params
    const slug = slugify(name, { lower: true })
    const orgUuid = uuid()

    try {
        const [id] = await knex('organisation')
            .transacting(transaction)
            .insert({
                created_at: knex.fn.now(),
                created_by_user_id: userId,
                name,
                slug,
                uuid: orgUuid
            }).returning('id')

        return { id, name, slug, uuid: orgUuid }
    } catch ( err ) {
        throw new Error(`Could not create organisation: ${err.message}`)
    }
}

module.exports = createOrganisationAsync
