const joi = require('joi')

module.exports = joi.object().keys({
    userId: joi.string(),
    reviewText: joi.string(),
    rate: joi.number().integer(),
})
