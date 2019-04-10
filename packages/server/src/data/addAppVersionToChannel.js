
const joi = require('joi')

const paramSchema = joi.object().keys({
    appVersionId: joi.number().required(),
    createdByUserId: joi.number().required().min(1),
    channelName: joi.string().required().max(50),
    minDhisVersion : joi.string().required().min(1),
    maxDhisVersion: joi.string().required().allow(''),
}).options({ allowUnknown: true })

/**
 * @typedef {object} AddAppVersionToChannelResult
 * @property {number} id The inserted database id
 */


/**
 * Publish an app version to a channel
 *
 * @param {object} params The parameters used to publish an app version to a specific channel
 * @param {number} params.appVersionId The appversion db id to publish
 * @param {number} params.currentUserId The id for the user doing this action
 * @param {string} params.channelName Name of the channel to publish this app version to
 * @param {string} params.minDhisVersion Minimum dhis2 version supported for example 2.29
 * @param {string} params.maxDhisVersion Maximum dhis2 version supported for example 2.31
 * @param {object} knex DB instance of knex
 * @param {object} trx The transaction to operate on
 * @returns {Promise<AddAppVersionToChannelResult>}
 */
const addAppVersionToChannel = async (params, knex, transaction) => {

    const validation = paramSchema.validate(params)

    if ( validation.error !== null ) {
        throw new Error(validation.error)
    }    

    const { appVersionId, createdByUserId, channelName, minDhisVersion, maxDhisVersion } = params
    try {
        const [channel] = await knex('channel').select('id').where({ name: channelName })

        const [id] = await knex('app_channel')
            .transacting(transaction)
            .insert({
                app_version_id: appVersionId,
                channel_id: channel.id,
                created_at: knex.fn.now(),
                created_by_user_id: createdByUserId,
                min_dhis2_version: minDhisVersion,
                max_dhis2_version: maxDhisVersion
            }).returning('id')

        if ( id < 0 ) {
            throw new Error('Inserted id was < 0')
        }

        return { id }

    } catch ( err ) {
        throw new Error(`Could not add app version with id ${appVersionId} to channel ${channelName}. ${err.message}`)
    }
}

module.exports = addAppVersionToChannel
