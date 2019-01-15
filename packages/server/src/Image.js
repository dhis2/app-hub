const joi = require('joi')

module.exports = joi.object().keys({
    caption: joi.string(),
    description: joi.string(),
    imageUrl: joi.string().uri(),
    logo: joi.boolean(),
})
