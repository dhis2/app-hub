const debug = require('debug')('apphub:server:data:deleteChannel')

/**
 * Deletes a channel if no apps is published to it, otherwise it will throw an error.
 *
 * @param {string} uuid UUID for the channel to delete
 * @param {object} knex DB instance or transaction
 * @returns {Promise} object
 */
module.exports = async (uuid, knex) => {
    if (!uuid || !knex) {
        throw new Error('Invalid parameters, either uuid or knex is missing')
    }

    debug('trying to delete the channel')
    const deletedRows = await knex('channel')
        .where('id', uuid)
        .del()

    debug(`deleted ${deletedRows} rows in table channel for uuid ${uuid}`)

    return deletedRows > 0
}
