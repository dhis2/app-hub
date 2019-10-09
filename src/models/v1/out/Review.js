const joi = require('@hapi/joi')

module.exports = joi.object().keys({
    userId: joi.string(),
    reviewText: joi.string(),
    rate: joi.number().integer(),
})
