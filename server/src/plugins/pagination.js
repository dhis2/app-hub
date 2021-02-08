const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const Joi = require('../utils/CustomJoi')

/**
 * This plugin hooks into onPrehandler, processing all requests it's enabled for.
 *
 * The purpose of the plugin is to group all paging-queries in `request.plugins.pagination`.
 */

// Joi-schema for paging props
// key-names can be changed by using .rename() - but you must renmame
// to the original keys
const querySchema = Joi.object({
    page: Joi.number()
        .default(1)
        .min(1),
    pageSize: Joi.number()
        .default(25)
        .min(1),
})

// renames are supported here as well, but you must rename to the original keys
const resultSchema = Joi.object({
    pager: Joi.object({
        page: Joi.number(),
        pageCount: Joi.number(),
        pageSize: Joi.number(),
        total: Joi.number(),
    }),
    result: Joi.array(),
})

const onPreHandler = function(request, h) {
    const routeOptions = request.route.settings.plugins.pagination || {}
    if (!routeOptions.enabled) {
        return h.continue
    }

    try {
        const pagingParams = Joi.attempt(request.query, querySchema, {
            stripUnknown: true,
        })
        Object.keys(pagingParams).forEach(key => delete request.query[key])
        request.plugins.pagination = pagingParams
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
 * @returns hapi toolkit.response() with the pager and paginated
 * results.
 */
function paginate({ result, total = result.length }) {
    if (!Array.isArray(result)) {
        throw Boom.badImplementation('result must be an array')
    }

    const { page, pageSize } = this.request.plugins.pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const pager = {
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
        total,
    }
    const formatted = Joi.attempt({
        pager,
        result: result.slice(startIndex, endIndex)
    }, resultSchema)
    return this.response(formatted)
}

const paginationPlugin = {
    name: 'PaginationPlugin',
    register: async (server) => {
        server.ext('onPreHandler', onPreHandler)
        server.decorate('toolkit', 'paginate', paginate)
    },
}

module.exports = paginationPlugin
