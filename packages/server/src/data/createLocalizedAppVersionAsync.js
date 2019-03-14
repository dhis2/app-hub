const slugify = require('slugify')

/**
 * Inserts a localized application version
 * @param {number} userId Created by user id
 * @param {number} appVersionId
 * @param {string} description Description of the app version in the specified languageCode
 * @param {string} name Name of the app version in the specified languageCode
 * @param {string} languageCode 2 character ISO code for language
 * @param {object} knex
 * @param {object} transaction
 */
const createLocalizedAppVersionAsync = async (userId, appVersionId, description, name, languageCode, knex, transaction) => {

    const insertedLocalisedAppVersionId = await knex('app_version_localised')
        .transacting(transaction)
        .insert({
            app_version_id: appVersionId,
            created_at: knex.fn.now(),
            created_by_user_id: userId,  //todo: change to real id
            description,
            name,
            slug: slugify(name, { lower:true }),
            language_code: languageCode
        }).returning('id')

    if ( !insertedLocalisedAppVersionId || insertedLocalisedAppVersionId[0] <= 0 ) {
        throw new Error(`Could not create localized appversion for: ${appVersionId}, ${userId}, ${description}, ${name}, ${languageCode}`)
    }

}

module.exports = createLocalizedAppVersionAsync
