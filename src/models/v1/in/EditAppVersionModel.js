const joi = require('joi')

const payloadSchema = {
    demoUrl: joi.string().allow(''),
    version: joi.string(),
    minDhisVersion: joi
        .string()
        .required()
        .allow([null, '']),
    maxDhisVersion: joi
        .string()
        .required()
        .allow([null, '']),
    channel: joi.string(),
}

const EditAppVersionModel = joi.object().keys(payloadSchema)

module.exports = {
    payloadSchema,
    def: EditAppVersionModel,
    validate: objectToValidate => joi.validate(objectToValidate, EditAppModel),
}
