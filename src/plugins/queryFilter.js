const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const debug = require('debug')('apphub:server:plugins:queryFilter')
const Joi = require('@hapi/joi')
const { Filter, Filters } = require('../utils/Filter')
const { toSQLOperator } = require('../utils/filterUtils')
const FILTER_TYPE = 'filter'

const defaultOptions = {
    enabled: false, // default disabled for all routes
    method: ['GET'],
    ignoreKeys: ['paging'],
}

const descriptionsCache = {}

const onPreHandler = function(request, h) {
    const routeOptions = request.route.settings.plugins.queryFilter || {}

    const options = {
        ...this.options,
        ...routeOptions,
        ignoreKeys: this.options.ignoreKeys.concat(
            routeOptions.ignoreKeys || []
        ),
    }

    if (
        !options.enabled ||
        !options.method.includes(request.method.toUpperCase())
    ) {
        return h.continue
    }
    const routeQueryValidation = request.route.settings.validate.query
    const queryFilterKeys = new Set()
    let schemaDescription = descriptionsCache[request.path]

    if (Joi.isSchema(routeQueryValidation)) {
        if (!schemaDescription) {
            schemaDescription = descriptionsCache[
                request.path
            ] = routeQueryValidation.describe()
        }
        Object.keys(schemaDescription.keys).forEach(k => {
            const keyDesc = schemaDescription.keys[k]
            if (keyDesc.type === FILTER_TYPE) {
                queryFilterKeys.add(k)
            }
        })
    }

    const queryFilters = Object.keys(request.query).reduce((acc, curr) => {
        if (
            queryFilterKeys.has(curr) &&
            options.ignoreKeys.indexOf(curr) === -1
        ) {
            acc[curr] = request.query[curr]
        }
        return acc
    }, {})

    try {
        const filters = new Filters(queryFilters, {
            description: schemaDescription,
            validate: routeQueryValidation,
        })
        request.plugins.queryFilter = filters
    } catch (e) {
        Bounce.rethrow(e, 'system')
        throw Boom.boomify(e, { statusCode: 400 })
    }

    return h.continue
}

const filterPlugin = {
    name: 'FilterPlugin',
    register: async (server, options) => {
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
