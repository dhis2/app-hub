const joi = require('@hapi/joi')
const { definition: defaultDefinition } = require('./Default')
const { createDefaultValidator } = require('./helpers')

const definition = defaultDefinition
    .append({
        name: joi.string(),
        email: joi.string(),
    })
    .label('User')

const parseDatabaseJson = createDefaultValidator(definition)

module.exports = {
    def: definition,
    definition,
    parseDatabaseJson,
}
