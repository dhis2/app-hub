const appExists = require('./appExists')

/**
 * @typedef CreateAppStatusResult
 * @property {number} id Database id for the inserted status
 */

/**
 * Inserts an app status and returns the database id
 *
 * @param {object} params
 * @param {number} params.userId
 * @param {number} params.appId
 * @param {number} params.status A value (string) from the AppStatus enum, APPROVED|PENDING|NOT_APPROVED
 * @param {object} knex DB instance of knex, or transaction
 * @returns {Promise<CreateAppStatusResult>} result object with database id for inserted app_status row
 */
const createAppStatus = async (params, knex) => {
    const { userId, appId, status } = params
    try {
        //Make sure the app exist
        if (!(await appExists(appId, knex))) {
            throw new Error(`Invalid appId, app does not exist.`)
        }

        const [{ id }] = await knex('app_status')
            .insert({
                created_at: knex.fn.now(),
                created_by_user_id: userId,
                app_id: appId,
                status,
            })
            .returning('id')

        if (id < 0) {
            throw new Error('Inserted id was < 0')
        }

        return { id }
    } catch (err) {
        throw new Error(
            `Could not save app status: ${status} for appId: ${appId}. ${err.message}`
        )
    }
}

module.exports = createAppStatus
