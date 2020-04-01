const Joi = require('@hapi/joi')

/**
 * Creates a default function to validating
 * and transform results the given definition (a joi schema).
 * @param {Joi.Schema} defintion - The joi schema to use
 *
 * @returns {function(dbResult): []} - A function taking some data (may be an array or object) to be validated by the schema.
 * The function throws a ValidationError if mapping fails
 */
const createDefaultValidator = schema => {
    return dbResult =>
        Array.isArray(dbResult)
            ? dbResult.map(v => Joi.attempt(v, schema))
            : Joi.attempt(dbResult, schema)
}

module.exports = {
    createDefaultValidator,
}
