/**
 * Returns true if the app exists otherwise false
 * @param {*} appId Database id of the app to check
 * @param {*} knex Database connection
 */
const appExists = async (appId, knex) => {
    //Make sure the app exist

    try {
        const app = await knex('app')
            .select()
            .where('id', appId)

        return app && app.length > 0
    } catch (err) {
        return false
    }
}

module.exports = appExists
