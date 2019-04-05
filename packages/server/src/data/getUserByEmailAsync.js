/**
 * 
 * @param {string} email Email to fetch the user for.
 * @param {*} knex 
 */
const getUserByEmailAsync = async (email, knex) => {

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

module.exports = getUserByEmailAsync

