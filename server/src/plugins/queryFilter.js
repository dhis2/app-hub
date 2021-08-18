const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const Joi = require('@hapi/joi')
const { Filters } = require('../utils/Filter')
const { parseFilterString } = require('../utils/filterUtils')

/**
 * This plugin hooks into onPrehandler, processing all requests it's enabled for.
 * It's designed to be used in conjunction with CustomJoi.js that extends Joi
 * with a filter type. The filters are validated through Hapi's validate.query.
 *
 * The purpose of the plugin is to group all filters in `request.plugins.queryFilter.filters`.
 * The value of this property is an instance of Filters.
 *
 * All options can be overwritten by each route.
 * Options:
 *  enabled - enable the queryFilter
 *  ignoreKeys - ignore the key. Note that only keys of type Joi.filter() in the validate.query object are used.
 *  rename - A Joi-schema with .rename() functions that are used to get renames of the keys.
 *           Can also be a plain Object with keys being the query-name, and the value being the database-name.
 *      This is used to rename API-facing filter-names to database-column names.
 */

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

const onPreHandler = function (request, h) {
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

    if (rename && Joi.isSchema(rename)) {
        if (!renameDescription) {
            renameDescription = renameDescriptions[request.path] =
                rename.describe()
        }
        renameMap = renameDescription.renames.reduce((acc, curr) => {
            const { from, to } = curr
            acc[from] = to
            return acc
        }, {})
    }

    if (Joi.isSchema(routeQueryValidation)) {
        if (!validateDescription) {
            validateDescription = validateDescriptions[request.path] =
                routeQueryValidation.describe()
            // if schema has Joi.alternatives(), use first schema-alternative
            if (validateDescription.matches) {
                validateDescription = validateDescription.matches[0].schema
            }
        }
        // only add validations with .filter()
        Object.keys(validateDescription.keys).forEach(k => {
            const keyDesc = validateDescription.keys[k]
            if (keyDesc.type === FILTER_TYPE) {
                queryFilterKeys.add(k)
            }
        })
    } else {
        // add all keys if no validation
        Object.keys(request.query).forEach(key => {
            const val = request.query[key]
            const parsed = parseFilterString(val)
            request.query[key] = parsed
            queryFilterKeys.add(key)
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
