const joi = require('joi')

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

module.exports = {
    def: definition,
    definition,
}
