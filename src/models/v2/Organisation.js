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
        // createdByUser: joi.string(),   TODO: should we rename 'createdByUserUuid' to this and use that for internal and external models?
        createdByUserUuid: joi.string(),
        createdByUserId: joi.number().alter({
            external: s => s.strip(),
        }),
    })
    .alter({
        db: s =>
            s
                .append({ created_by_user_id: joi.number() })
                .rename('createdByUserId', 'created_by_user_id'),
    })
    .rename('created_by_user_uuid', 'createdByUserUuid', {
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

const formatDatabaseJson = createDefaultValidator(dbDefinition);

module.exports = {
    def: definition,
    definition,
    dbDefinition,
    externalDefintion,
    defWithUsers,
    parseDatabaseJson,
    formatDatabaseJson
}
