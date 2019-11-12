const debug = require('debug')('appstore:server:data:getUserByEmail')
/**
 * Load a user from db for the specified email
 *
 * @param {string} email Email to try and find the user for
 * @param {*} knex db instance
 * @param {Promise<object>}
 */
const getUserByEmail = async (email, knex) => {
    let user = null

    if (!email) {
        return null
    }

    if (!knex) {
        throw new Error(`Missing parameter 'knex'`)
    }

    try {
        user = await knex('users')
            .select()
            .where('email', email)
            .first()
        debug('found user', user)
    } catch (err) {
        //TODO: log, re-throw or something other than silent fail?
        debug(err)
    }

    return user ? user : null
}

module.exports = getUserByEmail
