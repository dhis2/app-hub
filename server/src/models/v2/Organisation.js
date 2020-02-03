const joi = require('@hapi/joi')
const User = require('./User')
const { definition: defaultDefinition } = require('./Default')
const { extractKeysWithTag, createDefaultValidator } = require('./helpers')
const definition = defaultDefinition
    .append({
        name: joi.string().tag('filterable'),
        slug: joi.string(),
        owner: joi
            .string()
            .guid({ version: 'uuidv4' })
            .tag('filterable'),
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

const filterDefinition = extractKeysWithTag(definition, 'filterable').append({
    user: joi.string().guid(),
})

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
    filterDefinition,
}
