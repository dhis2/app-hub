const Boom = require('@hapi/boom')
const Joi = require('../utils/CustomJoi')
const debug = require('debug')('apphub:server:security:apiKeyScheme')
const schemeName = 'api-key'

const optionsSchema = Joi.object({
    validate: Joi.function().required(),
    headerKey: Joi.string().default('x-api-key'),
    keySchema: Joi.object()
        .schema()
        .default(
            Joi.string()
                .required()
                .length(36)
                .message('Invalid API key format')
        ),
})

const scheme = function(server, schemeOptions) {
    const options = Joi.attempt(schemeOptions, optionsSchema)
    debug('API-key scheme setup')
    return {
        authenticate: async (request, h) => {
            const apiKey = request.headers[options.headerKey]
            if (!apiKey) {
                return h.unauthenticated(Boom.unauthorized(null, 'api-key'))
            }
            Joi.attempt(apiKey, options.keySchema)
            if (apiKey) {
                try {
                    const { isValid, credentials } = await options.validate(
                        apiKey,
                        request,
                        h
                    )
                    if (isValid) {
                        return h.authenticated({ credentials })
                    }
                } catch (e) {
                    debug('API-key validation failed', e)
                }
            }

            return h.unauthenticated(Boom.unauthorized('Invalid API key'))
        },
    }
}

const plugin = {
    register: function(server, pluginOptions) {
        server.auth.scheme(schemeName, scheme)
    },
}

module.exports = {
    plugin,
    scheme,
}
