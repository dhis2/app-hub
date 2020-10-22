/**
 * Returns true if the app exists otherwise false
 * @param {*} appId Database id of the app to check
 * @param {object} knex DB instance of knex, or transaction
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
