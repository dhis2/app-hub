const Joi = require('../../utils/CustomJoi')
const { definition: defaultDefinition } = require('./Default')
const { createDefaultValidator } = require('./helpers')

const definition = defaultDefinition
    .append({
        appId: Joi.string(),
        version: Joi.string(),
        channel: Joi.string().required(),
        demoUrl: Joi.string().uri().allow(null, ''),
        downloadUrl: Joi.string().uri().allow(''),
        minDhisVersion: Joi.string().required(),
        maxDhisVersion: Joi.string().allow(null, ''),
    })
    .label('AppVersion')

const dbDefinition = definition.tailor('db')

// internal -> external
const externalDefinition = definition.tailor('external')

// database -> internal
const parseDatabaseJson = createDefaultValidator(definition)

// internal -> database
const formatDatabaseJson = createDefaultValidator(dbDefinition)

module.exports = {
    def: definition,
    definition,
    dbDefinition,
    externalDefinition,
    parseDatabaseJson,
    formatDatabaseJson,
}
