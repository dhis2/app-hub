const joi = require('@hapi/joi')
const {
    definition: defaultDefinition,
    createDefaultParseDatabaseJson,
} = require('./Default')

const definition = defaultDefinition.append({
    name: joi.string(),
    email: joi.string(),
})

const parseDatabaseJson = createDefaultParseDatabaseJson(definition)

module.exports = {
    def: definition,
    definition,
    parseDatabaseJson,
}
