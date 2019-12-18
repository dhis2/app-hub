const joi = require('@hapi/joi')
const User = require('./User')
const {
    definition: defaultDefinition,
    createDefaultValidator,
} = require('./Default')

const definition = defaultDefinition
    .append({
        name: joi.string(),
        slug: joi.string(),
        createdByUser: joi.string().guid({ version: 'uuidv4' }),
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
                .rename('createdByUser', 'created_by_user_id'),
    })
    .rename('created_by_user_id', 'createdByUser', {
        ignoreUndefined: true,
    })

const defWithUsers = definition.append({
    users: joi
        .array()
        .items(User.definition)
        .required(),
})

const dbDefinition = definition.tailor('db')

const externalDefintion = definition.tailor('external')

const parseDatabaseJson = createDefaultValidator(definition)

const formatDatabaseJson = createDefaultValidator(dbDefinition)

module.exports = {
    def: definition,
    definition,
    dbDefinition,
    externalDefintion,
    defWithUsers,
    parseDatabaseJson,
    formatDatabaseJson,
}
