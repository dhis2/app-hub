const joi = require('@hapi/joi')

const definition = joi
    .object()
    .keys({
        id: joi.number().alter({ external: s => s.strip()}),
        uuid: joi.string().guid({ version: 'uuidv4' }),
        updatedAt: joi
            .date()
            .cast('number')
            .allow(null),
        createdAt: joi.date().cast('number'),
    })
    .rename('updated_at', 'updatedAt', { ignoreUndefined: true })
    .rename('created_at', 'createdAt', { ignoreUndefined: true })
    .prefs({
       stripUnknown: true,
    })

/**
 * Creates a default function to parse database result to internal model. Validating
 * and transforming using the given definition (a joi schema).
 * @param {Joi.Schema} defintion - The joi schema to use
 *
 * @returns {function(dbResult): []} - A function taking the database result (may be an array or object) that validates and transforms
 * the results according to the joi-schema.
 * The function throws a ValidationError if mapping fails
 */
function createDefaultParseDatabaseJson(schema) {
    return function(dbResult) {
        return Array.isArray(dbResult) ? dbResult.map(v => joi.attempt(v, schema)) : joi.attempt(dbResult, schema)
    }
}

module.exports = {
    def: definition,
    definition,
    createDefaultParseDatabaseJson,
}
