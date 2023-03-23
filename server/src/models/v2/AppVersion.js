const Joi = require('../../utils/CustomJoi')
const { definition: defaultDefinition } = require('./Default')
const { createDefaultValidator } = require('./helpers')
const { AppStatuses } = require('../../enums/index.js')
const { versionOperatorMap } = require('./../../utils/filterUtils')

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
    })
    .alter({
        db: (s) =>
            s
                .rename('minDhisVersion', 'min_dhis2_version')
                .rename('maxDhisVersion', 'max_dhis2_version')
                .rename('demoUrl', 'demo_url'),
        // remove fields from external-response
        external: (s) => s.fork(['slug'], (s) => s.strip()),
    })
    .label('AppVersion')

const dbDefinition = definition.tailor('db')

// internal -> external
const externalDefinition = definition.tailor('external')

// database -> internal
const parseDatabaseJson = createDefaultValidator(definition)

// internal -> database
const formatDatabaseJson = createDefaultValidator(dbDefinition)

const filterOperators = Object.keys(versionOperatorMap)

const baseVersionFilterSchema = Joi.filter().operator(
    Joi.string().valid(...filterOperators)
)

// pretty loose version matching
// ensures that
//    a version starts with a digit or a letter    ^[\w\d]+
//    a version is only made up of alphanumeric characters, dots and dashes
//    a digit follows a dot   (\.\d[\w-]*)*
const versionRegex = /^[\w\d]+(\.\d[\w-]*)*$/
const versionValueSchema = Joi.string()
    .trim()
    .pattern(versionRegex)
    .message('"{{#value}}" is not a valid version')

const versionFilterSchema = baseVersionFilterSchema
    .operator(Joi.string().valid(...filterOperators))
    .value(versionValueSchema)
    .value(Joi.stringArray().items(versionValueSchema), {
        operators: ['in', 'ne'],
    })
    .description(
        `Filter by version. Supports filter operators: \`${filterOperators}\``
    )

module.exports = {
    def: definition,
    definition,
    dbDefinition,
    externalDefinition,
    parseDatabaseJson,
    formatDatabaseJson,
    versionFilterSchema,
}
