const joi = require('joi')

const Developer = require('./Developer.js')
const Organisation = require('./Organisation.js')
const Review = require('./Review')
const Version = require('./Version')
const Image = require('./Image')

module.exports = joi.object().keys({
    name: joi.string(),
    description: joi.string(),
    type: joi
        .string()
        .valid(['APP', 'DASHBOARD_WIDGET', 'TRACKER_DASHBOARD_WIDGET']),
    developer: Developer,
    organisation: Organisation,
    reviews: joi.array().items(Review),
    versions: joi.array().items(Version),
    images: joi.array().items(Image),
    status: joi.string().valid(['PENDING', 'NOT_APPROVED', 'APPROVED']),
})
