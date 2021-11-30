const Joi = require('joi')
const { AppTypes } = require('../../../enums')
const { isSemver, isValidDHIS2Version } = require('../../helpers')

const CreateModelAppData = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    appType: Joi.string().valid(...AppTypes),
    sourceUrl: Joi.string().uri(),
    developer: Joi.object().keys({
        email: Joi.string().email(),
        organisationId: Joi.string(),
    }),
    version: Joi.object().keys({
        version: Joi.string().custom(isSemver, 'semver validate'),
        minDhisVersion: Joi.string().custom(
            isValidDHIS2Version,
            'DHIS2 validate version'
        ),
        maxDhisVersion: Joi.string()
            .allow('')
            .custom(isValidDHIS2Version, 'DHIS2 validate version'),
        demoUrl: Joi.string().uri().allow(''),
        channel: Joi.string(),
    }),
    coreApp: Joi.bool(),
})

const payloadSchema = Joi.object({
    //multipart gets parsed as streams so we have to allow any and manually validate in the handler.
    app: Joi.any(),
    logo: Joi.any(),
    file: Joi.any(),
})

module.exports = {
    payloadSchema,
    def: CreateModelAppData,
    validate: obj => CreateModelAppData.validate(obj),
}
