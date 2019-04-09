/**
 * Load a user from db for the specified email
 * @function getUserByEmail
 * @param {string} email Email to try and find the user for
 * @param {*} knex db instance
 * @param {Promise<object>}
 */
module.exports = async (email, knex) => {

    let user = null

    const usersWithEmail = await knex.select().from('users').where('email', email)
    console.dir(usersWithEmail)
    if ( usersWithEmail && usersWithEmail.length === 1 ) {
        user = usersWithEmail[0]
    } else if ( usersWithEmail && usersWithEmail.length > 1 ) {
        throw new Error(`Multiple developers found with same e-mail: ${email}`)
    }

    return user
}

