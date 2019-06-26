const joi = require('joi')

module.exports = joi.object().keys({
    uuid: joi.string().guid({ version: 'uuidv4' }),
    name: joi.string(),
    address: joi.string(),
})
