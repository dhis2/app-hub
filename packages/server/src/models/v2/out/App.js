const Joi = require('joi')

const { AppTypes } = require('@enums')

// database def
const def = Joi.object().keys({
    appType: Joi.string()
        .required()
        .valid(AppTypes),

    id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required(),
})

module.exports = {
    def,
}
