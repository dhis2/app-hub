const joi = require('joi')

const { AppStatuses, AppTypes } = require('../../../enums')

/*const Developer = require('./Developer.js')
const Organisation = require('./Organisation.js')
const Review = require('./Review')
const Version = require('./Version')
const Image = require('./Image')*/

// database def
const def = joi.object().keys({
    
    appType: joi
            .string()
            .valid(AppTypes),

    id: joi
        .string()
        .guid({ version: 'uuidv4' })
        .required(),

    created: joi
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

    description: joi
                .string()
                .max(255, 'utf8')
                .required(),

    status: joi
            .string()
            .valid(AppStatuses),

    // foreign key references
//    developer: joi.number().required(),
    //organisation: joi.number(),
})

module.exports = {
    def,
    validate: obj => def.validate(obj),
}
