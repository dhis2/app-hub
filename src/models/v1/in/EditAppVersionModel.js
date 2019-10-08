const joi = require('@hapi/joi')

const payloadSchema = {
    demoUrl: joi.string().allow(''),
    version: joi.string().allow(''),
    minDhisVersion: joi
        .string()
        .required()
        .allow(null, ''),
    maxDhisVersion: joi
        .string()
        .required()
        .allow(null, ''),
}

const EditAppVersionModel = joi.object().keys(payloadSchema)

module.exports = {
    payloadSchema,
    def: EditAppVersionModel,
    validate: objectToValidate => joi.validate(objectToValidate, EditAppModel),
}
