const debug = require('debug')('appstore:server:data:deleteChannel')
/**
 * Deletes a channel if no apps is published to it, otherwise it will throw an error.
 *
 * @param {string} uuid UUID for the channel to delete
 * @param {object} knex database connection
 * @returns {Promise} object
 */
module.exports = async (uuid, knex) => {
    if (!uuid || !knex) {
        throw new Error('Invalid parameters, either uuid or knex is missing')
    }

    try {
        const [{ count }] = await knex('apps_view')
            .where('channel_id', uuid)
            .count()
        if (+count > 0) {
            return {
                deleted: 0,
                success: false,
                message:
                    'Can not delete a channel which has apps published to it.',
            }
        }

        const deletedRows = await knex('channel')
            .where('id', uuid)
            .del()
        debug(`Deleted ${deletedRows} rows in table channel for uuid ${uuid}`)

        return {
            deleted: deletedRows,
            success: deletedRows === 1,
            message: `${deletedRows} channel(s) deleted`,
        }
    } catch (err) {
        debug(`Could not delete channel: ${err.message}`)
        throw new Error(`Could not delete channel: ${err.message}`)
    }
}
