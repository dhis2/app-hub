const Joi = require('../utils/CustomJoi')

const createDefaultPagingResultSchema = itemsSchema =>
    Joi.object({
        pager: Joi.object({
            page: Joi.number(),
            pageCount: Joi.number(),
            pageSize: Joi.number(),
            total: Joi.number(),
        }),
        result: itemsSchema ? Joi.array().items(itemsSchema) : Joi.array(),
    })

// Joi-schema for paging props
// key-names can be changed by using .rename() - but you must renmame
// to the original keys
const defaultPagingQuerySchema = Joi.object({
    paging: Joi.boolean().default(true),
    page: Joi.number().default(1).min(1),
    pageSize: Joi.number().default(25).min(1),
})

const withPagingQuerySchema = joiSchema =>
    Joi.alternatives().try(
        defaultPagingQuerySchema.concat(joiSchema),
        joiSchema
    )
const withPagingResultSchema = joiSchema =>
    Joi.alternatives().try(
        createDefaultPagingResultSchema(joiSchema),
        joiSchema
    )

const defaultOptions = {
    schema: createDefaultPagingResultSchema(),
}
class Pager {
    constructor(pagingParams, options = defaultOptions) {
        this.enabled = pagingParams.paging
        this.page = pagingParams.page
        this.pageSize = pagingParams.pageSize

        this.schema = options.schema
    }

    applyToQuery(query) {
        if (!this.enabled) {
            return
        }

        const knex = query.client
        const offset = (this.page - 1) * this.pageSize
        query.select(knex.raw('count(*) over() as total_count'))
        query.limit(this.pageSize)
        query.offset(offset)
    }

    enable() {
        this.enabled = true
    }

    disable() {
        this.enabled = false
    }

    formatResult(queryResult, total) {
        if (!this.enabled) {
            return queryResult
        }

        const pagerObject = {
            page: this.page,
            pageSize: this.pageSize,
            pageCount: Math.ceil(total / this.pageSize),
            total,
        }

        return Joi.attempt(
            {
                pager: pagerObject,
                result: queryResult,
            },
            this.schema
        )
    }
}

module.exports = {
    default: Pager,
    Pager,
    defaultPagingQuerySchema,
    createDefaultPagingResultSchema,
    withPagingQuerySchema,
    withPagingResultSchema,
}
