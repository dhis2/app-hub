const Joi = require('../../utils/CustomJoi')
const { definition: defaultDefinition } = require('./Default')
const { createDefaultValidator } = require('./helpers')
const { AppStatuses } = require('../../enums/index.js')

const definition = defaultDefinition
    .append({
        appId: Joi.string().guid({ version: 'uuidv4' }),
        version: Joi.string(),
        channel: Joi.string().required(),
        demoUrl: Joi.string().uri().allow(null, ''),
        downloadUrl: Joi.string().uri().allow(''),
        downloadCount: Joi.number().greater(-1),
        minDhisVersion: Joi.string().required(),
        maxDhisVersion: Joi.string().allow(null, ''),
        slug: Joi.string(),
        status: Joi.string().valid(...AppStatuses),
        hasChangelog: Joi.boolean().allow(null),
    })
    .alter({
        db: (s) =>
            s
                .rename('minDhisVersion', 'min_dhis2_version')
                .rename('maxDhisVersion', 'max_dhis2_version')
                .rename('demoUrl', 'demo_url'),
        external: (s) => s.strip('slug'),
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
