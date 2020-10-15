const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const Joi = require('@hapi/joi')
const { Pager } = require('../query/Pager')

/**
 * This plugin hooks into onPrehandler, processing all requests it's enabled for.
 *
 * The purpose of the plugin is to group all paging-queries in `request.plugins.pagination`.
 * The value of this property is an instance of Pager.
 *
 * All options can be overwritten by each route.
 * Options:
 *  enabled - enable the paginationPlugin
 */

const defaultOptions = {
    enabled: false,
}

const pagingSchema = Joi.object({
    paging: Joi.boolean().default(true),
    page: Joi.number()
        .default(1)
        .min(1),
    pageSize: Joi.number()
        .default(25)
        .min(1),
})

const onPreHandler = function(request, h) {
    const routeOptions = request.route.settings.plugins.pagination || {}

    const options = {
        ...this.options,
        ...routeOptions,
    }

    if (!options.enabled) {
        return h.continue
    }

    const routeQuery = request.query

    const pagingObject = Joi.attempt(routeQuery, pagingSchema, {
        stripUnknown: true,
    })

    try {
        const pager = new Pager(pagingObject)
        request.plugins.pagination = pager
    } catch (e) {
        Bounce.rethrow(e, 'system')
        throw Boom.boomify(e, { statusCode: 400 })
    }

    return h.continue
}

const paginationPlugin = {
    name: 'PaginationPlugin',
    register: async (server, options) => {
        const opts = {
            ...defaultOptions,
            options,
        }
        server.bind({
            options: opts,
        })

        server.ext('onPreHandler', onPreHandler)
    },
}

module.exports = paginationPlugin
