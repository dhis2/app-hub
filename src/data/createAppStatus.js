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
 * @returns {Promise<CreateAppStatusResult>} inserted id
 */
const createAppStatus = async (params, knex) => {
    const { userId, appId, status } = params
    const transaction = await knex.transaction()
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

        await transaction.commit()
        return { id }
    } catch (err) {
        await transaction.rollback()
        throw new Error(
            `Could not save app status: ${status} for appId: ${appId}. ${
                err.message
            }`
        )
    }
}

module.exports = createAppStatus
