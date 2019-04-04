/**
 * Re
 * @param {*} developer 
 * @param {*} knex 
 */
const getDeveloperByEmailAsync = async (email, knex) => {

    let developer = null

    const developersWithEmail = await knex.select().from('users').where('email', email)
    console.dir(developersWithEmail)
    if ( developersWithEmail && developersWithEmail.length === 1 ) {
        developer = developersWithEmail[0]
    } else if ( developersWithEmail && developersWithEmail.length > 1 ) {
        throw new Error(`Multiple developers found with same e-mail: ${email}`)
    }

    return developer
}

module.exports = getDeveloperByEmailAsync

