const joi = require('@hapi/joi')

const def = joi.object().keys({
    uuid: joi.string().guid({ version: 'uuidv4' }),
    name: joi.string(),
    slug: joi.string(),
    users: joi.array(joi.any()),
})

module.exports = {
    def,
}
