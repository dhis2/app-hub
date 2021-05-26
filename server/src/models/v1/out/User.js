const Joi = require('@hapi/joi')

module.exports = Joi.object().keys({
    address: Joi.string().allow(''),
    email: Joi.string().email(),
    organisation: Joi.string(),
})
