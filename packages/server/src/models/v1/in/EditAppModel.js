const joi = require('joi')

const { AppTypes } = require('@enums')

const payloadSchema = {
    appType: joi.string().valid(AppTypes),
    description: joi.string().allow(''),
    developer: joi.object().keys({
        address: joi.string().allow(''),
        email: joi.string().email(),
        name: joi.string(),
        organisation: joi.string(),
    }),
    name: joi.string().max(100),
    sourceUrl: joi.string().allow(''),
}

const EditAppModel = joi.object().keys(payloadSchema)

module.exports = {
    payloadSchema,
    def: EditAppModel,
    validate: objectToValidate => joi.validate(objectToValidate, EditAppModel),
}
