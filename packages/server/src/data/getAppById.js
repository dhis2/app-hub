/**
 * Fetch an app based on its database id
 *
 * @param {number} id id for the app to fetch
 * @param {*} knex db instance
 * @param {Promise}
 */
const getAppById = async (appId, knex) => {
    if (!appId) {
        throw new Error(`Missing parameter 'appId'`)
    }

    if (!knex) {
        throw new Error(`Missing parameter 'knex'`)
    }

    try {
        const [app] = await knex('apps')
            .select()
            .where('id', appId)

        return app
    } catch (err) {
        throw new Error(`Could not get app with id: ${appId}`)
    }
}

module.exports = getAppById
