const Joi = require('joi')

const { AppStatuses, AppTypes } = require('../../../enums')

/*const Developer = require('./Developer.js')
const Organisation = require('./Organisation.js')
const Review = require('./Review')*/
const Version = require('./Version')
/*const Image = require('./Image')*/

// database def
const def = Joi.object().keys({
    
    appType: Joi
            .string()
            .required()
            .valid(AppTypes),

    id: Joi
        .string()
        .guid({ version: 'uuidv4' })
        .required(),

    created: Joi
        .date()
        .iso()
        .required(),
        
    lastUpdated: Joi
        .date()
        .iso()
        .required(),

    name: Joi
        .string()
        .max(255, 'utf8')
        .required(),

    description: Joi
                .string()
                .max(255, 'utf8')
                .required(),

    status: Joi
            .string()
            .required()
            .valid(AppStatuses),

    versions: Joi.array().items(Version).required().min(1)
    // foreign key references
//    developer: joi.number().required(),
    //organisation: joi.number(),
})

module.exports = {
    def
}
