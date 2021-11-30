const joi = require('joi')
const { isSemver, isValidDHIS2Version } = require('../../helpers')

const payloadSchema = joi.object({
    demoUrl: joi.string().uri().allow(''),
    version: joi.string().custom(isSemver, 'semver validate'),
    minDhisVersion: joi
        .string()
        .required()
        .allow(null, '')
        .custom(isValidDHIS2Version, 'DHIS2 validate version'),
    maxDhisVersion: joi
        .string()
        .required()
        .allow(null, '')
        .custom(isValidDHIS2Version, 'dhis2 version validate'),
    channel: joi.string(),
})

const EditAppVersionModel = payloadSchema

module.exports = {
    payloadSchema,
    def: EditAppVersionModel,
    validate: objectToValidate =>
        joi.validate(objectToValidate, EditAppVersionModel),
}
