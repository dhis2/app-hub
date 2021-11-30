const Joi = require('joi')

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

/**
 * Creates a function that can be used to format some data with Joi.
 * This is quite similar to createDefaultValidator, but does not throw
 * when a validation error in encountered.
 * Validation errors are thus ignored.
 * @param {Joi.Schema} schema
 * @returns value after Joi.validate() is run
 */

const createDefaultFormatter = schema => {
    return data => {
        if (Array.isArray(data)) {
            const res = data.map(v => schema.validate(v).value)
            return res
        }
        const { value } = schema.validate(data)

        return value
    }
}

module.exports = {
    createDefaultValidator,
    createDefaultFormatter,
}
