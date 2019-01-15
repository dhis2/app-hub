const joi = require('joi')

module.exports = joi.object().keys({
    uuid: joi.guid({ version: 'uuidv4' }),
    name: joi.string(),
    address: joi.string(),
})
