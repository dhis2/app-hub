const joi = require('joi')

const debug = require('debug')('apphub:server:data:createAppVersion')

const appExists = require('./appExists')

const paramsSchema = joi
    .object()
    .keys({
        userId: joi.string().uuid().required(),
        appId: joi.string().uuid().required(),
        demoUrl: joi.string().uri().allow('', null),
        changeSummary: joi.string().allow('', null),
        sourceUrl: joi.string().uri().allow('', null),
        version: joi.string().allow(''),
        d2config: joi.string().allow('', null),
    })
    .options({ allowUnknown: true })

/**
 * @typedef {object} CreateAppVersionResult
 * @param {number} id Database id of the newly created app version
 * @param {string} uuid The generated UUID of the app version
 */

/**
 * Creates a version for the app
 *
 * @param {object} params
 * @param {number} params.userId User id
 * @param {number} params.appId App id
 * @param {string} params.demoUrl URL where the app can be seen or tested
 * @param {string} params.changeSummary The change summary of the version to be created
 * @param {string} params.sourceUrl URL where to find the source, for example github
 * @param {string} params.version A version for the app version to create for example normally something like 1.2 or 1.4.5
 * @param {object} knex DB instance of knex, or transaction
 * @property {Promise<CreateAppVersionResult>}
 */
const createAppVersion = async (params, knex) => {
    const paramsValidation = paramsSchema.validate(params)

    if (paramsValidation.error !== undefined) {
        debug(paramsValidation.error)
        throw paramsValidation.error
    }

    const {
        userId,
        appId,
        demoUrl,
        changeSummary,
        sourceUrl,
        version,
        d2config,
    } = params
    debug('got params: ', params)

    try {
        if (!(await appExists(appId, knex))) {
            throw new Error(`Invalid appId, app does not exist.`)
        }

        const [{ id }] = await knex('app_version')
            .insert({
                app_id: appId,
                created_at: knex.fn.now(),
                created_by_user_id: userId,
                demo_url: demoUrl || '',
                change_summary: changeSummary,
                source_url: sourceUrl || '',
                version: version || '',
                d2config,
            })
            .returning('id')

        return {
            id,
            userId,
            appId,
            demoUrl,
            changeSummary,
            sourceUrl,
            version,
            d2config,
        }
    } catch (err) {
        throw new Error(
            `Could not create appversion for appid: ${appId}, ${userId}, ${demoUrl}, ${changeSummary}, ${sourceUrl}, ${version}. ${err.message}`
        )
    }
}

module.exports = createAppVersion
