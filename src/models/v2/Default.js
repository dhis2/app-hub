const joi = require('@hapi/joi')

const definition = joi
    .object()
    .keys({
        id: joi.string().guid({ version: 'uuidv4' }),
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
 * Creates a default function to validating
 * and transform results the given definition (a joi schema).
 * @param {Joi.Schema} defintion - The joi schema to use
 *
 * @returns {function(dbResult): []} - A function taking some data (may be an array or object) to be validated by the schema.
 * The function throws a ValidationError if mapping fails
 */
function createDefaultValidator(schema) {
    return function(dbResult) {
        return Array.isArray(dbResult)
            ? dbResult.map(v => joi.attempt(v, schema))
            : joi.attempt(dbResult, schema)
    }
}

module.exports = {
    def: definition,
    definition,
    createDefaultValidator,
}
