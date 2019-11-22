const joi = require('@hapi/joi')
const {
    definition: defaultDefinition,
    createDefaultValidator,
} = require('./Default')

const definition = defaultDefinition.append({
    name: joi.string(),
    email: joi.string(),
})

const parseDatabaseJson = createDefaultValidator(definition)

module.exports = {
    def: definition,
    definition,
    parseDatabaseJson,
}
