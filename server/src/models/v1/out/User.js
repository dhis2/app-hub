const Joi = require('joi')

module.exports = Joi.object().keys({
    address: Joi.string().allow(''),
    email: Joi.string().email(),
    organisation: Joi.string(),
    organisation_slug: Joi.string(),
})
