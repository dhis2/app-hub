const Boom = require('@hapi/boom')
const Joi = require('joi')
const Path = require('path')

const allowedImageMimeTypes = ['image/jpeg', 'image/png']
const imageMetadataSchema = Joi.object({
    headers: Joi.object({
        'content-type': Joi.string().valid(...allowedImageMimeTypes),
    }).unknown(),
    filename: Joi.string(),
}).unknown()

const validateImageMetadata = (mimos, imageMetadata) => {
    Joi.assert(imageMetadata, imageMetadataSchema)
    return validateExtensionForMimeType(
        mimos,
        imageMetadata.filename,
        allowedImageMimeTypes
    )
}

const validateExtensionForMimeType = (mimos, filePath, mimeTypes) => {
    if (!Array.isArray(mimeTypes)) {
        mimeTypes = [mimeTypes]
    }
    const ext = Path.extname(filePath).substring(1)
    const mimeExtensions = mimeTypes.flatMap(t => mimos.type(t).extensions)
    if (mimeExtensions.includes(ext)) {
        return true
    }
    throw Boom.badRequest(`File extension must be one of [${mimeExtensions}]`)
}

module.exports = {
    validateImageMetadata,
    validateExtensionForMimeType,
}
