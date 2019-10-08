const Joi = require('@hapi/joi')

/**
 * For client implementation see /client/src/api/api.js - createUploadVersionOptions
 */

const CreateAppVersionModel = Joi.object().keys({
    version: Joi.string(),
    minDhisVersion: Joi.string(),
    maxDhisVersion: Joi.string().allow(''),
    demoUrl: Joi.string().allow(''),
    images: Joi.array(),
})

const payloadSchema = {
    //multipart gets parsed as streams so we have to allow any and manually validate in the handler.
    version: Joi.any(),
    file: Joi.any(),
}

module.exports = {
    payloadSchema,
    def: CreateAppVersionModel,
    validate: obj => Joi.validate(obj, CreateAppVersionModel),
}
