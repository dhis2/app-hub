
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

    try {
        const [id] = await knex('app_status')
            .transacting(transaction)
            .insert({
                created_at: knex.fn.now(),
                created_by_user_id: userId,
                app_id: appId,
                status
            }).returning('id')

        if ( id < 0 ) {
            throw new Error('Inserted id was < 0')
        }

        return { id }
    
    } catch ( err ) {
        throw new Error(`Could not save app status: ${status} for appId: ${appId}. ${err.message}`);
    }
}

module.exports = createAppStatusAsync
