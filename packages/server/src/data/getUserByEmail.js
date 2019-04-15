/**
 * Load a user from db for the specified email
 *
 * @param {string} email Email to try and find the user for
 * @param {*} knex db instance
 * @param {Promise<object>}
 */
const getUserByEmail = async (email, knex) => {

    let user = null

    const usersWithEmail = await knex('users').select().where('email', email)
    console.dir(usersWithEmail)
    if ( usersWithEmail && usersWithEmail.length === 1 ) {
        user = usersWithEmail[0]
    } else if ( usersWithEmail && usersWithEmail.length > 1 ) {
        throw new Error(`Multiple developers found with same e-mail: ${email}`)
    }

    return user
}

module.exports = getUserByEmail
