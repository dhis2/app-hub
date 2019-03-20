const slugify = require('slugify')

/**
 * Inserts a localized application version
 * @param {object} params
 * @param {object} knex
 * @param {object} transaction
 */
const createLocalizedAppVersionAsync = async (params, knex, transaction) => {

    const { userId, appVersionId, description, name, languageCode } = params
    try {
        const [id] = await knex('app_version_localised')
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

        if ( id < 0 ) {
            throw new Error('Inserted id was < 0')
        }

        return { id }
    } catch ( err ) {
        throw new Error(`Could not create localized appversion for: ${appVersionId}, ${userId}, ${description}, ${name}, ${languageCode}`)
    }

}

module.exports = createLocalizedAppVersionAsync
