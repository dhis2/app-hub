const Joi = require('../utils/CustomJoi')

const defaultPagingResultSchema = Joi.object({
    pager: Joi.object({
        page: Joi.number(),
        pageCount: Joi.number(),
        pageSize: Joi.number(),
        total: Joi.number(),
    }),
    result: Joi.array(),
})

const defaultOptions = {
    schema: defaultPagingResultSchema,
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

module.exports = { default: Pager, Pager }
