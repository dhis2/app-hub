const joi = require('@hapi/joi')

const def = joi.object().keys({
    uuid: joi.string().guid({ version: 'uuidv4' }),
    name: joi.string(),
    slug: joi.string(),
    updatedAt: joi.number(),
    createdAt: joi.number(),
})

module.exports = {
    def,
}
