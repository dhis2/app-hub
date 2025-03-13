const joi = require('joi')

const paramsSchema = joi
    .object()
    .keys({
        changelog: joi.string().allow('', null),
        id: joi.string().uuid().required(),
    })
    .options({ allowUnknown: false })

/**
 * Patches an app instance
 *
 * @param {object} params
 * @param {string} params.id id of the app to update
 * @param {string} params.changelog The changelog of the app
 * @returns {Promise<CreateUserResult>}
 */
const patchApp = async (params, knex) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const { id, ...rest } = params

    try {
        await knex('app').update(rest).where({
            id,
        })
    } catch (err) {
        throw new Error(`Could not update app: ${id}. ${err.message}`)
    }
}

module.exports = patchApp
