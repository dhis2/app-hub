/**
 * Load a user from db for the specified email
 *
 * @param {string} email Email to try and find the user for
 * @param {*} knex db instance
 * @param {Promise<object>}
 */
const getUserByEmail = async (email, knex) => {
    let user = null

    try {
        user = await knex('users')
            .select()
            .where('email', email)
            .first()
    } catch (err) {
        //TODO: log, re-throw or something other than silent fail?
        console.log(err)
    }

    return user ? user : null
}

module.exports = getUserByEmail
