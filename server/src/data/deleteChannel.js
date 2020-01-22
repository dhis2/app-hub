const debug = require('debug')('apphub:server:data:deleteChannel')

/**
 * Deletes a channel if no apps is published to it, otherwise it will throw an error.
 *
 * @param {string} uuid UUID for the channel to delete
 * @param {object} knex database connection
 * @param {object} transaction database transaction
 * @returns {Promise} object
 */
module.exports = async (uuid, knex, transaction) => {
    if (!uuid || !knex || !transaction) {
        throw new Error('Invalid parameters, either uuid or knex is missing')
    }

    debug('trying to delete the channel')
    const deletedRows = await knex('channel')
        .transacting(transaction)
        .where('id', uuid)
        .del()

    debug(`deleted ${deletedRows} rows in table channel for uuid ${uuid}`)

    return deletedRows > 0
}
