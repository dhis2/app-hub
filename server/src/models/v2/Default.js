const joi = require('@hapi/joi')

/*
    The default base definition of an entity.
    This can be used to validate and transform an object using joi.validate()
    or joi.attempt.

    Other definitions can inherit and add to this this by .append()
    Any renames and transformations are from database -> internal.
    So an object validated directly by this definition are expected to be of
    database shape, and results in an internal-model.

    Any unknown keys are removed.

    Note that all fields are optional by default.
    This is by design, as we do not want to enforce all database-queries
    to include every field.
    The idea is that all validations and transformation use this as a base.
    This way we have one place to update the type if anything were to change.
    Using defintion.extract() we can grab the base field and build upon it with eg. .required()

*/

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
