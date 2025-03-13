const joi = require('../../utils/CustomJoi')
const { definition: defaultDefinition } = require('./Default')
const { createDefaultValidator } = require('./helpers')
const User = require('./User')

const partialApp = joi.object().keys({
    type: joi.string(),
    createdAt: joi.number(),
    description: joi.string().allow(''),
    images: joi.any(),
    id: joi.string(),
    app_id: joi.string(),
    name: joi.string(),
    organisation: joi.any(),
    hasPlugin: joi.boolean().allow(null, false),
})

const definition = defaultDefinition
    .append({
        name: joi.string().max(100),
        email: joi.string().email().allow(null),
        description: joi.string().allow(null),
        slug: joi.string(),
        owner: joi.string().guid({ version: 'uuidv4' }),
        users: joi.array().items(User.definition),
        apps: joi.array().items(partialApp.options({ allowUnknown: false })),
    })
    .alter({
        db: (s) =>
            s
                .append({
                    created_by_user_id: joi
                        .string()
                        .guid({ version: 'uuidv4' }),
                })
                .rename('owner', 'created_by_user_id'),
    })
    .rename('created_by_user_id', 'owner', {
        ignoreUndefined: true,
    })
    .label('Organisation')

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
