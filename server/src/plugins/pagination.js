const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const Joi = require('../utils/CustomJoi')
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
 * querySchema - Joi schema for query-params. Should use default as a base, and are mostly
 * intended to be used to rename keys or change defaults through Joi.
 * resultSchema - Joi schema for formatted result. Should use default as a base, and are mostly
 * intended to be used to rename keys or change defaults through Joi.
 * keepParams - If true, the query-params related to paging will not be removed from request.query
 * decorate - decorate options, or false if toolkit should not be decorated.
 * decorate.slice - if false, toolkit.paginate will not change the result array, and will be returned
 * as is.
 */

// Joi-schema for paging props
// key-names can be changed by using .rename() - but you must renmame
// to the original keys
const defaultPagingQuerySchema = Joi.object({
    paging: Joi.boolean().default(true),
    page: Joi.number()
        .default(1)
        .min(1),
    pageSize: Joi.number()
        .default(25)
        .min(1),
})

// renames are supported here as well, but you must rename to the original keys
const defaultPagingResultSchema = Joi.object({
    pager: Joi.object({
        page: Joi.number(),
        pageCount: Joi.number(),
        pageSize: Joi.number(),
        total: Joi.number(),
    }),
    result: Joi.array(),
})

const optionsSchema = Joi.object({
    enabled: Joi.bool().default(false),
    querySchema: Joi.object()
        .schema()
        .default(defaultPagingQuerySchema),
    resultSchema: Joi.object()
        .schema()
        .default(defaultPagingResultSchema),
    keepParams: Joi.bool().default(false),
    decorate: Joi.alternatives()

        .try(
            Joi.bool().valid(false),
            Joi.object({
                slice: Joi.bool(),
            })
        )

        .default({ slice: true }),
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

    try {
        const pagingParams = Joi.attempt(routeQuery, options.querySchema, {
            stripUnknown: true,
        })

        const pager = new Pager(pagingParams, {
            schema: options.resultSchema,
        })

        if (!options.keepParams) {
            Object.keys(pagingParams).forEach(key => delete request.query[key])
        }
        request.plugins.pagination = pager
    } catch (e) {
        Bounce.rethrow(e, 'system')
        throw Boom.boomify(e, { statusCode: 400 })
    }

    return h.continue
}

/**
 * Decorates the toolkit (h in handler) with a function "paginate".
 * This can be used to paginate results directly, without
 * paginating the actual DB-query.
 *
 * It uses the pager to set the paging-meta on the response.
 * Unless options.slice is false, the resulting array will have a max-size
 * of pager.pageSize, and try to slice the array accordingly.
 * @param options
 * @param options.slice
 * @returns hapi toolkit.response() with the pager and paginated
 * results.
 */
const createPaginateDecoration = function(opts) {
    return function paginate(pager, { result, total }, options = {}) {
        if (!Array.isArray(result)) {
            throw Boom.badImplementation('result must be an array')
        }
        options = {
            ...opts,
            ...options,
        }
        //console.log('decor opts', this)

        let res = result
        if (options.slice) {
            const startIndex = (pager.page - 1) * pager.pageSize
            const endIndex = startIndex + pager.pageSize
            res = result.slice(startIndex, endIndex)
        }
        if (!total) {
            total = result.length
        }

        const formatted = pager.formatResult(res, total)
        return this.response(formatted)
    }
}

const paginationPlugin = {
    name: 'PaginationPlugin',
    register: async (server, options = {}) => {
        const opts = Joi.attempt(options, optionsSchema)

        server.bind({
            options: opts,
        })

        server.ext('onPreHandler', onPreHandler)

        // validate plugin settings so that we don't need to do this during runtime
        server
            .table()
            .filter(r => r.settings.plugins && r.settings.plugins.pagination)
            .map(r =>
<<<<<<< HEAD
                Joi.attempt(
=======
                Joi.assert(
>>>>>>> next
                    r.settings.plugins.pagination,
                    optionsSchema,
                    `PaginationPlugin validation failed at route ${r.path}:`
                )
            )

        if (opts.decorate) {
            server.decorate(
                'toolkit',
                'paginate',
                createPaginateDecoration(opts.decorate)
            )
        }
    },
}

module.exports = paginationPlugin
