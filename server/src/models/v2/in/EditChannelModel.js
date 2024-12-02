const joi = require('joi')

const payloadSchema = joi.object({
    name: joi.string().required(),
})

const EditChannelModel = payloadSchema

module.exports = {
    payloadSchema,
    def: EditChannelModel,
    validate: (objectToValidate) => EditChannelModel.validate(objectToValidate),
}
