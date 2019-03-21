const uuid = require('uuid/v4')
const joi = require('joi')

const paramsSchema = joi.object().keys({
    userId: joi.number().required(),
    appId: joi.number().required(),
    demoUrl: joi.string().allow(''),
    sourceUrl: joi.string().allow(),
    version: joi.string().allow('')
}).options({ allowUnknown: true })


/**
 * Creates a version for the app
 * @param {*} params
 * @param {*} knex
 * @param {*} transaction
 */
const createAppVersionAsync = async (params, knex, transaction) => {

    const paramsValidation = paramsSchema.validate(params)
    if ( paramsValidation.error !== null ) {
        throw new Error(paramsValidation.error)
    }

    const { userId, appId, demoUrl, sourceUrl, version } = params
    const versionUuid = uuid()

    try {
        const [id] = await knex('app_version')
            .transacting(transaction)
            .insert({
                app_id: appId,
                created_at: knex.fn.now(),
                created_by_user_id: userId,
                uuid: versionUuid,
                demo_url: demoUrl,
                source_url: sourceUrl,
                version
            }).returning('id')

        if ( id < 0 ) {
            throw new Error('Inserted id was < 0')
        }

        return { id, uuid: versionUuid }
    } catch ( err ) {
        throw new Error(`Could not create appversion for appid: ${appId}, ${userId}, ${demoUrl}, ${sourceUrl}, ${version}. ${err.message}`)
    }
}

module.exports = createAppVersionAsync