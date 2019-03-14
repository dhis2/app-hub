
/**
 * Inserts an app status and returns the database id
 * @param {number} userId
 * @param {number} appId
 * @param {*} status
 * @param {object} knex
 * @param {object} transaction
 * @returns {Promise<number>} inserted id
 */
const createAppStatusAsync = async (userId, appId, status, knex, transaction) =>  {

    const appStatusIds = await knex('app_status')
        .transacting(transaction)
        .insert({
            created_at: knex.fn.now(),
            created_by_user_id: userId,
            app_id: appId,
            status
        }).returning('id')

    if ( !appStatusIds || appStatusIds[0] <= 0 ) {
        throw new Error(`Could not save app status: ${status} for appId: ${appId}`);
    }

    return { id: appStatusIds[0] }
}

module.exports = createAppStatusAsync
