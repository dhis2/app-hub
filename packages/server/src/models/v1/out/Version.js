const joi = require('joi')

module.exports = joi.object().keys({
    version: joi.string(),
    minDhisVersion: joi.string(),
    maxDhisVersion: joi.string(),
    downloadUrl: joi.string().uri(),
    demoUrl: joi.string().uri(),
})
