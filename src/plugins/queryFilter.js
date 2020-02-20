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

// Holds Joi-schema descriptions, as these can be quite expensive to generate and this is a hot-path
// cached by path as key

// validateDescriptions is used to get queryParams with Filter-type
const validateDescriptions = {}
// renameDescriptions is used to rename the filter-Keys to the correct DB-column
const renameDescriptions = {}

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
    const rename = routeOptions.rename
    const queryFilterKeys = new Set()
    let renameMap = rename
    let validateDescription = validateDescriptions[request.path]
    let renameDescription = renameDescriptions[request.path]

    if (rename) {
        if (Joi.isSchema(rename)) {
            if (!renameDescription) {
                renameDescription = renameDescriptions[
                    request.path
                ] = rename.describe()
            }
            renameMap = renameDescription.renames.reduce((acc, curr) => {
                const { from, to } = curr
                acc[from] = to
                return acc
            }, {})
        }
    }

    if (Joi.isSchema(routeQueryValidation)) {
        if (!validateDescription) {
            validateDescription = validateDescriptions[
                request.path
            ] = routeQueryValidation.describe()
        }

        Object.keys(validateDescription.keys).forEach(k => {
            const keyDesc = validateDescription.keys[k]
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
            renameMap,
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
