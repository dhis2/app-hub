const Joi = require('joi')
const { isSemver, isValidDHIS2Version } = require('../../helpers')

/**
 * For client implementation see /client/src/api/api.js - createUploadVersionOptions
 */

const CreateAppVersionModel = Joi.object().keys({
    version: Joi.string().required().custom(isSemver, 'semver validate'),
    minDhisVersion: Joi.string()
        .required()
        .custom(isValidDHIS2Version, 'DHIS2 validate version'),
    maxDhisVersion: Joi.string()
        .allow('', null)
        .custom(isValidDHIS2Version, 'DHIS2 validate version'),
    demoUrl: Joi.string().uri().allow('', null),
    channel: Joi.string().required(),
})

const payloadSchema = Joi.object({
    //multipart gets parsed as streams so we have to allow any and manually validate in the handler.
    version: Joi.any(),
    file: Joi.any(),
})

module.exports = {
    payloadSchema,
    def: CreateAppVersionModel,
    validate: obj => CreateAppVersionModel.validate(obj),
}
