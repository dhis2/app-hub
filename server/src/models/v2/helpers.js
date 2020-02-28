const Joi = require('@hapi/joi')

/**
 * Extracts keys with a certain tag from a Joi-schema.
 * The joi-schema is assumed to be an object.
 * Does not modify the schema, returns a new Joi-schema of type object.
 * @param {*} schema Joi schema to extract keys from
 * @param {string} tag the 'tag' user to filter included keys.
 */

const extractKeysWithTag = (schema, tag) => {
    const description = schema.describe()
    const keysWithTags = Object.keys(description.keys).filter(k => {
        const keyDesc = description.keys[k]
        return keyDesc.tags && keyDesc.tags.includes(tag)
    })
    let schemaWithTags = Joi.object()
    keysWithTags.forEach(k => {
        const s = schema.extract(k)
        schemaWithTags = schemaWithTags.append({ [k]: s })
    })
    const schemaWithTagsDesc = schemaWithTags.describe()
    description.renames.forEach(rename => {
        if (schemaWithTagsDesc.keys[rename.from]) {
            schemaWithTags = schemaWithTags.rename(
                rename.from,
                rename.to,
                rename.options
            )
        }
    })

    return schemaWithTags
}

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
    extractKeysWithTag,
    createDefaultValidator,
}
