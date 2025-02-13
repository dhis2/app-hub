const Joi = require('joi')
const { AppStatuses, AppTypes } = require('../../../enums')
const Image = require('./Image')
const Developer = require('./User')
const Version = require('./Version')

// v1 api schema
const def = Joi.object().keys({
    appType: Joi.string()
        .required()
        .valid(...AppTypes),

    created: Joi.number(),

    description: Joi.string().allow(''),
    coreApp: Joi.bool(),

    developer: Developer.required(),

    images: Joi.array().items(Image).required(),

    id: Joi.string().uuid().required(),

    lastUpdated: Joi.number(),

    name: Joi.string().max(255, 'utf8').required(),

    owner: Joi.string().required(),

    reviews: Joi.array().items(Joi.any()).required(),

    sourceUrl: Joi.string().uri().allow(''),

    status: Joi.string()
        .required()
        .valid(...AppStatuses),

    versions: Joi.array().items(Version).min(1),

    hasPlugin: Joi.boolean().allow(null, false),

    // only indicating if there is a changelog or not here
    // to avoid addding a masssive changelog to the payload
    hasChangelog: Joi.boolean().allow(null, false),

    pluginType: Joi.string().allow(null),
})

module.exports = {
    def,
}
