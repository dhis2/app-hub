const Joi = require('../utils/CustomJoi')

const createDefaultPagingResultSchema = (itemsSchema) =>
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

const withPagingQuerySchema = (joiSchema) => {
    return defaultPagingQuerySchema.concat(joiSchema)
}

const withPagingResultSchema = (joiSchema) =>
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
    applyToQuery(query, includeTotal) {
        if (!this.enabled) {
            return
        }
        const offset = (this.page - 1) * this.pageSize

        if (includeTotal) {
            const knex = query.client
            query.select(knex.raw('count(*) over() as total_count'))
        }

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

    sliceResult(result) {
        const startIndex = (this.page - 1) * this.pageSize
        const endIndex = startIndex + this.pageSize
        return result.slice(startIndex, endIndex)
    }

    getPagerObject(total) {
        return {
            page: this.page,
            pageSize: this.pageSize,
            pageCount: Math.ceil(total / this.pageSize),
            total,
        }
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

        return Joi.attempt(
            {
                pager: this.getPagerObject(total),
                result: queryResult,
            },
            this.schema
        )
    }

    sliceAndFormatResult(originalResult) {
        const result = this.sliceResult(originalResult)
        return Joi.attempt(
            {
                pager: this.getPagerObject(result.length),
                result,
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
