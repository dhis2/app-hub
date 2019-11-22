const joi = require('@hapi/joi')
const User = require('./User')
const {
    definition: defaultDefinition,
    createDefaultParseDatabaseJson,
} = require('./Default')

const definition = defaultDefinition
    .append({
        name: joi.string(),
        slug: joi.string(),
        // createdByUser: joi.string(),
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

const renamer = (to, from, opts) => s => s.rename(to, from, opts)

const defWithUsers = definition.append({
    users: joi
        .array()
        .items(User.definition)
        .required(),
})

const filter = joi
    .object({
        uuid: joi.string().guid(),
        name: joi.string(),
        slug: joi.string(),
        userUuid: joi.string().guid(),
    })
    .prefs({
        stripUnknown: true,
    })

const dbDefinition = definition.tailor('db')

const parseDatabaseJson = createDefaultParseDatabaseJson(definition)

module.exports = {
    def: definition,
    definition,
    dbDefinition,
    defWithUsers,
    parseDatabaseJson,
    filter,
}
