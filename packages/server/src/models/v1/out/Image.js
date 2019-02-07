const Joi = require('joi')

module.exports = Joi.object().keys({
    caption: Joi.string(),
    created: Joi.date().iso().required(),
    description: Joi.string().allow(null),
    id: Joi.string(),
    imageUrl: Joi.string().uri(),
    lastUpdated: Joi.number(),
    logo: Joi.boolean(),
})
