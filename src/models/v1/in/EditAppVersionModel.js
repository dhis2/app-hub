const joi = require('@hapi/joi')

const payloadSchema = joi.object({
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
})

const EditAppVersionModel = payloadSchema

module.exports = {
    payloadSchema,
    def: EditAppVersionModel,
    validate: objectToValidate => joi.validate(objectToValidate, EditApp),
}
