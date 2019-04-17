const Joi = require('joi')

module.exports = Joi.object().keys({
    address: Joi.string().allow(''),
    email: Joi.string().email(),
    name: Joi.string(),
    organisation: Joi.string(),
})
