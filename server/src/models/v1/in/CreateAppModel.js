const Joi = require('@hapi/joi')
const { isSemver } = require('../../helpers')

const { AppTypes } = require('../../../enums')

const CreateModelAppData = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string().allow(''),
    appType: Joi.string().valid(...AppTypes),
    sourceUrl: Joi.string()
        .uri()
        .allow(''),
    developer: Joi.object().keys({
        email: Joi.string().email(),
        address: Joi.string().allow(''),
        organisation: Joi.string(),
    }),
    versions: Joi.array().items(
        Joi.object().keys({
            version: Joi.string().custom(isSemver, 'semver validate'),
            minDhisVersion: Joi.string(),
            maxDhisVersion: Joi.string().allow(''),
            demoUrl: Joi.string()
                .uri()
                .allow(''),
            channel: Joi.string(),
        })
    ),
    images: Joi.array().items(
        Joi.object({
            caption: Joi.string().allow('', null),
            description: Joi.string().allow('', null),
        })
    ),
    owner: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        name: Joi.string().required(),
    }),
})

const payloadSchema = Joi.object({
    //multipart gets parsed as streams so we have to allow any and manually validate in the handler.
    app: Joi.any(),
    imageFile: Joi.any(),
    file: Joi.any(),
})

module.exports = {
    payloadSchema,
    def: CreateModelAppData,
    validate: obj => CreateModelAppData.validate(obj),
}
