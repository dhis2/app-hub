const Joi = require('joi')

module.exports = Joi.object().keys({
    version: Joi.string().required(),
    minDhisVersion: Joi.string().required(),
    maxDhisVersion: Joi.string().allow(null, ''),
    lastUpdated: Joi.number(),
    created: Joi.number(),
    id: Joi.string().guid({ version: 'uuidv4' }).required(),
    downloadUrl: Joi.string().uri().allow(''),
    demoUrl: Joi.string().uri().allow(''),
    channel: Joi.string().required(),
})
