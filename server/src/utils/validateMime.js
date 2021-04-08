const Joi = require('@hapi/joi')
const Path = require('path')

const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
const imageMetadataSchema = Joi.object({
    headers: Joi.object({
        'content-type': Joi.string().valid(...allowedImageMimeTypes),
    }).unknown(),
}).unknown()

const validateImageMetadata = (mimos, imageMetadata) => {
    Joi.assert(imageMetadata, imageMetadataSchema)
    return validateExtensionForMimeType(
        mimos,
        imageMetadata.filename,
        allowedImageMimeTypes
    )
}

const validateExtensionForMimeType = (mimos, filePath, ...types) => {
    const extensions = []
    for (const t of types) {
        const mimeExtensions = mimos.type(t)
        extensions.push(...mimeExtensions)
    }
    const ext = Path.extname(filePath).substring(1)
    return extensions.includes(ext)
}

module.exports = {
    validateImageMetadata,
    validateExtensionForMimeType,
}
