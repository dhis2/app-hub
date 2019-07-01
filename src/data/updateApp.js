const slugify = require('slugify')
const joi = require('joi')

const { AppTypes } = require('../enums')

const paramsSchema = joi
    .object()
    .keys({
        uuid: joi
            .string()
            .uuid()
            .required(),
        userId: joi.number(),
        name: joi.string().max(100),
        description: joi.string().allow(''),
        appType: joi.string().valid(AppTypes),
        sourceUrl: joi
            .string()
            .allow('')
            .max(500),
        languageCode: joi
            .string()
            .max(2)
            .required(),
    })
    .options({ allowUnknown: true })

/**
 * Updates an app
 *
 * @param {object} params
 * @param {string} params.uuid UUID of the app to update
 * @param {number} params.userId The user id of the user making the change
 * @param {string} params.name The name of the app
 * @param {string} params.description Description of the app
 * @param {string} params.sourceUrl The URL to the source code of the app, for example https://github.com/dhis2/app-store
 * @param {string} params.languageCode The 2 char language code for which language to update
 * @param {*} knex
 * @returns {Promise<CreateUserResult>}
 */
const updateApp = async (params, knex) => {
    const validation = joi.validate(params, paramsSchema)

    if (validation.error !== null) {
        throw new Error(validation.error)
    }

    /*
        uuid: firstApp.uuid,
        userId: firstApp.developer_id,
        name: 'Changed name',
        sourceUrl: 'https://some/url',
        demoUrl: 'http://some/other/url',
        description: 'Changed description'
    */

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const transaction = await knex.transaction()

    const {
        uuid,
        userId,
        name,
        sourceUrl,
        appType,
        description,
        languageCode,
    } = params

    try {
        const appVersionIdsToUpdate = await knex('app_version')
            .select('app_version.id')
            .innerJoin('app', 'app.id', 'app_version.app_id')
            .where('app.uuid', uuid)
            .pluck('app_version.id')

        await knex('app')
            .transacting(transaction)
            .update({
                type: appType,
                updated_at: knex.fn.now(),
                updated_by_user_id: userId,
            })
            .where({
                uuid,
            })

        await knex('app_version')
            .transacting(transaction)
            .update({
                source_url: sourceUrl,
                updated_at: knex.fn.now(),
                updated_by_user_id: userId,
            })
            .whereIn('id', appVersionIdsToUpdate)

        await knex('app_version_localised')
            .transacting(transaction)
            .update({
                name,
                slug: slugify(name, { lower: true }),
                description,
                updated_at: knex.fn.now(),
                updated_by_user_id: userId,
            })
            .whereIn('app_version_id', appVersionIdsToUpdate)
            .where('language_code', languageCode)

        await transaction.commit()
    } catch (err) {
        throw new Error(`Could not update app: ${uuid}. ${err.message}`)
    }
}

module.exports = updateApp
