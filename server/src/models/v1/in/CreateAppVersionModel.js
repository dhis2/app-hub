const Joi = require('@hapi/joi')
const { isSemver } =  require('../../helpers')


/**
 * For client implementation see /client/src/api/api.js - createUploadVersionOptions
 */

const CreateAppVersionModel = Joi.object().keys({
    version: Joi.string().custom(isSemver, 'semver validate'),
    minDhisVersion: Joi.string(),
    maxDhisVersion: Joi.string().allow('', null),
    demoUrl: Joi.string()
        .uri()
        .allow('', null),
    images: Joi.array(),
    channel: Joi.string(),
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
