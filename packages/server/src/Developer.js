const joi = require('joi')

const Organisation = require('./Organisation.js')

module.exports = joi
    .object()
    .keys({
        uuid: joi.guid({ version: 'uuidv4' }),
        name: joi.string(),
        oauth: joi.string(),
        organisation: Organisation,
        email: joi.string().email(),
    })
