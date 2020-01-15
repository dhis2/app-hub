const { Filter } = require('../utils/Filter')
const Boom = require('@hapi/boom')
const debug = require('debug')('apphub:server:plugins:queryFilter')
const Joi = require('@hapi/joi')
const defaultOptions = {
    enabled: true,
    method: ['GET'],
}

const onPreHandler = function(request, h) {
    const routeOptions = request.route.options.plugins.queryFilter

    if (!this.options.enabled || !routeOptions.enabled) {
        return h.continue
    }

    const filters = {}
    const joiValidate = (field, value) =>
        Joi.attempt(value, routeOptions.validate.extract(field))
    const validate = (field, value) =>
        Joi.isSchema(routeOptions.validate)
            ? joiValidate(field, value)
            : routeOptions.validate(field, value)

    Object.keys(request.query).forEach(function(key) {
        if (options.ignoredKeys.indexOf(key) === -1) {
            try {
                const filter = Filter.createFromFilterString(
                    key,
                    request.query[key]
                )

                if (routeOptions.validate) {
                    filter = validate(key, value)
                }

                filters[key] = filter
                delete request.query[key]
            } catch (e) {
                debug('Failed to parse filter', e)
                return Boom.badRequest(`Failed to parse filter for ${key}`)
            }
        }
    })

    request.query.filters = filters
    return h.continue
}

const filterPlugin = {
    name: 'FilterPlugin',
    register: async (server, options = defaultOptions) => {
        const opts = {
            ...defaultOptions,
            ...options,
        }
        server.bind({
            options: opts,
        })

        server.ext('onPreHandler', onPreHandler)
    },
}

module.exports = filterPlugin
