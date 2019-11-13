/**
 * Returns true if the app exists otherwise false
 * @param {*} appId Database id of the app to check
 * @param {*} knex Database connection
 * @param {*} transaction Optional transaction, if the appId might not be commited to the database yet for a transaction, the transaction must also be passed in otherwise it wont find the app
 */
const appExists = async (appId, knex, transaction) => {
    //Make sure the app exist

    try {
        let app = null

        if (transaction) {
            app = await knex('app')
                .transacting(transaction)
                .select()
                .where('id', appId)
        } else {
            app = await knex('app')
                .select()
                .where('id', appId)
        }

        return app && app.length > 0
    } catch (err) {
        return false
    }
}

module.exports = appExists
