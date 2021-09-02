const Joi = require('joi')

module.exports = Joi.object().keys({
    caption: Joi.string().allow(null, ''),
    created: Joi.number().required(),
    description: Joi.string().allow(null, ''),
    id: Joi.string(),
    imageUrl: Joi.string().uri(),
    lastUpdated: Joi.number(),
    logo: Joi.boolean(),
})
