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

    /**
     * Applies limit and offset to the query
     * @param {*} query
     */
    applyToQuery(query) {
        if (!this.enabled) {
            return
        }
        const offset = (this.page - 1) * this.pageSize
        query.limit(this.pageSize)
        query.offset(offset)
    }

    /**
     * Creates a knex-query that can be executed to retrieve the total_count
     * of the query (without limit and offsets)
     *
     * @param {*} query knex query to use for counting
     * @returns a knex-query which retrieves the total_count of the query.
     * only one row with column-key "total_count" is returned
     */
    getTotalCountQuery(query) {
        const cloned = query.clone().clear('limit').clear('offset')
        const knex = query.client.queryBuilder()
        return knex.count('* as total_count').from(cloned.as('dt')).first()
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
