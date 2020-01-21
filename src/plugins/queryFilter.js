const { Filter, Filters } = require('../utils/Filter')
const Boom = require('@hapi/boom')
const debug = require('debug')('apphub:server:plugins:queryFilter')
const Joi = require('@hapi/joi')

const defaultOptions = {
    enabled: true,
    method: ['GET'],
    ignoreKeys: ['paging'],
}

const schemaCache = {}
const onPreHandler = function(request, h) {
    //  console.log(request.route)
    const routeOptions = request.route.settings.plugins.queryFilter || {}

    const options = {
        ...this.options,
        ...routeOptions,
        ignoreKeys: this.options.ignoredKeys.concat(
            routeOptions.ignoredKeys || []
        ),
    }
    if (!options.enabled) {
        return h.continue
    }

    const queryFilters = Object.keys(request.query).reduce((acc, curr) => {
        if (options.ignoreKeys.indexOf(key) === -1) {
            acc[curr] = request.query[curr]
            delete request.query[curr]
        }
    }, {})
    const filters = Filters.createFromQueryFilters(
        queryFilters,
        routeOptions.validation
    )

    request.query.filters = filters
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
