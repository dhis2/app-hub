const Joi = require('@hapi/joi')

const { AppTypes } = require('../../../enums')

const CreateModelAppData = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string().allow(''),
    appType: Joi.string().valid(...AppTypes),
    sourceUrl: Joi.string()
        .uri()
        .allow(''),
    developer: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email(),
        address: Joi.string().allow(''),
        organisation: Joi.string(),
    }),
    versions: Joi.array().items(
        Joi.object().keys({
            version: Joi.string(),
            minDhisVersion: Joi.string(),
            maxDhisVersion: Joi.string().allow(''),
            demoUrl: Joi.string().allow(''),
        })
    ),
    images: Joi.array(),
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
