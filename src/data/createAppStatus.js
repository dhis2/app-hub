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
 * @param {object} knex
 * @param {object} transaction
 * @returns {Promise<CreateAppStatusResult>} inserted id
 */
const createAppStatus = async (params, knex, transaction) => {
    const { userId, appId, status } = params
    try {
        const [id] = await knex('app_status')
            .transacting(transaction)
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
            `Could not save app status: ${status} for appId: ${appId}. ${
                err.message
            }`
        )
    }
}

module.exports = createAppStatus
