const joi = require('@hapi/joi')

const paramsSchema = joi
    .object()
    .keys({
        uuid: joi
            .string()
            .uuid()
            .required(),
        userId: joi.number(),
        minDhisVersion: joi
            .string()
            .allow([null, ''])
            .max(10),
        maxDhisVersion: joi
            .string()
            .allow([null, ''])
            .max(10),
        version: joi.string(),
        demoUrl: joi
            .string()
            .allow('')
            .max(500),
    })
    .options({ allowUnknown: true })

/**
 * Updates an appversion and its min/max versions for existing channels it's published to
 *
 * @param {object} params
 * @param {string} params.uuid UUID of the version to update
 * @param {number} params.userId The user id of the user making the change
 * @param {string} params.minDhisVersion Minimum inclusive required version of DHIS2 this version is compatible with
 * @param {string} params.maxDhisVersion Minimum inclusive required version of DHIS2 this version is compatible with
 * @param {string} params.version The version number of the appversion provided by the developer, for example v1.0, v1.2
 * @param {string} params.demoUrl The URL to the source code of the app, for example https://github.com/dhis2/app-store
 * @param {*} knex
 * @returns {Promise<CreateUserResult>}
 */
const updateAppVersion = async (params, knex, transaction) => {
    const validation = joi.validate(params, paramsSchema)

    if (validation.error !== null) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const {
        uuid,
        userId,
        minDhisVersion,
        maxDhisVersion,
        version,
        demoUrl,
    } = params

    try {
        const appVersionIdsToUpdate = await knex('app_version')
            .select('id')
            .where('uuid', uuid)
            .pluck('id')

        await knex('app_version')
            .transacting(transaction)
            .update({
                demo_url: demoUrl,
                version,
                updated_at: knex.fn.now(),
                updated_by_user_id: userId,
            })
            .where('uuid', uuid)

        await knex('app_channel')
            .transacting(transaction)
            .update({
                max_dhis2_version: maxDhisVersion,
                min_dhis2_version: minDhisVersion,
                updated_at: knex.fn.now(),
                updated_by_user_id: userId,
            })
            .whereIn('app_version_id', appVersionIdsToUpdate)
    } catch (err) {
        throw new Error(`Could not update appversion: ${uuid}. ${err.message}`)
    }
}

module.exports = updateAppVersion
