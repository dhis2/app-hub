const joi = require('joi')

const { AppStatuses, AppTypes } = require('../../../enums')

/*const Developer = require('./Developer.js')
const Organisation = require('./out/Organisation.js')
const Review = require('./out/Review')
const Version = require('./out/Version')
const Image = require('./out/Image')*/

// database def
const def = joi.object().keys({
    app_id: joi.number().required(),
    uuid: joi
        .string()
        .guid({ version: 'uuidv4' })
        .required(),

    created_at: joi
        .date()
        .iso()
        .required(),
        
    updated_at: joi
        .date()
        .iso()
        .required(),

    name: joi
        .string()
        .max(255, 'utf8')
        .required(),

    description: joi.string().required(),

    status: joi.string().valid(AppStatuses),

    type: joi
        .string()
        .valid(AppTypes),

    source_url: joi
        .string()
        .empty('')
        .default(''),

    // foreign key references
    developer: joi.number().required(),
    organisation: joi.number(),
})

module.exports = {
    def,
    validate: obj => def.validate(obj),
}
