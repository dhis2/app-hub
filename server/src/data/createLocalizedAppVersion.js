const slugify = require('slugify')

/**
 * @typedef CreateLocalizedAppVersionResult
 * @property {number} id The inserted database id
 */

/**
 * Inserts a localized application version
 *
 * @param {object} params
 * @param {number} params.appVersionId Database id of the app version to insert the texts for
 * @param {number} params.userId User id inserting this
 * @param {string} params.description Description of the app version on the specified language
 * @param {string} params.name Name of the app version
 * @param {string} params.languageCode 2 char language code
 * @param {object} knex
 * @param {Promise<{id}>}
 */
const createLocalizedAppVersion = async (params, knex, transaction) => {
    //TODO: add validation of params with joi

    if (!transaction) {
        throw new Error('No transaction passed to function')
    }

    const { userId, appVersionId, description, name, languageCode } = params
    try {
        const [id] = await knex('app_version_localised')
            .transacting(transaction)
            .insert({
                app_version_id: appVersionId,
                created_at: knex.fn.now(),
                created_by_user_id: userId, //todo: change to real id
                description,
                name,
                slug: slugify(name, { lower: true }),
                language_code: languageCode,
            })
            .returning('id')

        if (id < 0) {
            throw new Error('Inserted id was < 0')
        }

        return { id }
    } catch (err) {
        throw new Error(
            `Could not create localized appversion for: ${appVersionId}, ${userId}, ${description}, ${name}, ${languageCode}`
        )
    }
}

module.exports = createLocalizedAppVersion
