const debug = require('debug')('apphub:server:executeQuery')

/**
 * Executes the knex-query, applying filters and paging if present
 *
 * @param {*} query the base knex-query reference
 * @param {*} queryHelper
 * @param {*} queryHelpers.filters an instance of Filters that can be used to applied filters
 * @param {*} queryHelpers.pager an instance of Pager that can be used to apply pagination to query
 * @param {*} queryHelpers.model a "model" object that can be used to format the output.
 * @param {*} options Options object
 * @param {*} options.formatter a function with signature `function(result)` that overrides format-logic from model, should return formatted result
 * @param {Boolean} options.slice if true and pager is present, the result will be sliced in memory, without using a second SQL-query.
 * */
async function executeQuery(
    query,
    { filters, pager, model } = {},
    options = {}
) {
    if (filters) {
        filters.applyAllToQuery(query)
    }

    if (pager && !options.slice) {
        pager.applyToQuery(query)
    }

    debug('Executing query: ' + query.toString())
    const rawResult = await query
    let result = rawResult

    if (options.formatter) {
        result = options.formatter(rawResult)
    } else if (model) {
        // parse if it's a "getter" - ie is a select-query
        // else we format it to db-format
        if (query._method === 'select') {
            result = model.parseDatabaseJson(result)
        } else {
            result = model.formatDatabaseJson(result)
        }
    }

    if (pager) {
        if (options.slice) {
            result = pager.sliceAndFormatResult(result)
        } else {
            const countQuery = pager.getTotalCountQuery(query)
            debug('Executing totalCount-query', countQuery.toString())
            const totalRes = await countQuery
            const totalCount = totalRes.total_count
            result = pager.formatResult(result, totalCount)
        }
    } else {
        // keep same API if not pager
        result = {
            result,
        }
    }

    return result
}

module.exports = {
    executeQuery,
}
