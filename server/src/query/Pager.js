const Joi = require('@hapi/joi')

const pagingResultSchema = Joi.object({
    pager: Joi.object({
        page: Joi.number(),
        pageCount: Joi.number(),
        pageSize: Joi.number(),
        total: Joi.number(),
    }),
    result: Joi.array(),
})

class Pager {
    constructor(pagingParams) {
        this.enabled = pagingParams.paging
        this.page = pagingParams.page
        this.pageSize = pagingParams.pageSize
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
            pageCount: queryResult.length,
            total,
        }

        return Joi.attempt(
            {
                pager: pagerObject,
                result: queryResult,
            },
            pagingResultSchema
        )
    }
}

module.exports = { default: Pager, Pager, pagingResultSchema }
