const joi = require('../../utils/CustomJoi')
const User = require('./User')
const { definition: defaultDefinition } = require('./Default')
const { createDefaultValidator } = require('./helpers')

const definition = defaultDefinition
    .append({
        name: joi.string(),
        slug: joi.string(),
        owner: joi.string().guid({ version: 'uuidv4' }),
        users: joi.array().items(User.definition),
    })
    .alter({
        db: s =>
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
const externalDefintion = definition.tailor('external')

// database -> internal
const parseDatabaseJson = createDefaultValidator(definition)

// internal -> database
const formatDatabaseJson = createDefaultValidator(dbDefinition)

module.exports = {
    def: definition,
    definition,
    dbDefinition,
    externalDefintion,
    parseDatabaseJson,
    formatDatabaseJson,
}
