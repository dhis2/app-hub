const joi = require('@hapi/joi')
const { isSemver } =  require('../../helpers')

const payloadSchema = joi.object({
    demoUrl: joi
        .string()
        .uri()
        .allow(''),
    version: joi.string().custom(isSemver, 'semver validate'),
    minDhisVersion: joi
        .string()
        .required()
        .allow(null, ''),
    maxDhisVersion: joi
        .string()
        .required()
        .allow(null, ''),
    channel: joi.string(),
})

const EditAppVersionModel = payloadSchema

module.exports = {
    payloadSchema,
    def: EditAppVersionModel,
    validate: objectToValidate =>
        joi.validate(objectToValidate, EditAppVersionModel),
}
