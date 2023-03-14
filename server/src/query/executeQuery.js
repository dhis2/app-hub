const debug = require('debug')('apphub:server:executeQuery')

const pagingStrategies = {
    WINDOW: 'window',
    SEPARATE: 'separate',
    SLICE: 'slice',
}

const defaultOptions = {
    pagingStrategy: pagingStrategies.WINDOW,
}

const selectMethods = {
    select: 'select',
    first: 'first',
    pluck: 'pluck',
}

/**
 * Check if the query is a select-query
 * @param {*} query the knex query
 * @returns true if the query is a "select"-query
 */
const isSelectQuery = (query) => {
    const method = query._method
    // the actual "command" is only available after the query has been executed
    // through listening to the `query`-event (see https://knexjs.org/guide/interfaces.html#query-response)
    // that would also make it async, so it's more flexible to check the _method property.
    return selectMethods[method] !== undefined
}

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
 * @param {string} options.pagingStrategy the strategy to use for pagination of the query.
 *  Valid options:
 *
 *    `window`: Default. A window-function (count() over() ) is used to get the total of the query together with the results.
 *     This does not work with eg. `distinct` selects.
 *
 *    `separate`: a separate query will be executed to get the total of the query.
 *
 *    `slice`: the SQL query will return all rows and be sliced in memory according to pager-obect,
 *
 * Note that this only has an effect if `pager` is present.
 * */
async function executeQuery(query, { filters, pager, model } = {}, options) {
    options = {
        ...defaultOptions,
        ...options,
    }

    if (filters) {
        filters.applyAllToQuery(query)
    }

    if (pager && options.pagingStrategy !== pagingStrategies.SLICE) {
        pager.applyToQuery(
            query,
            options.pagingStrategy === pagingStrategies.WINDOW
        )
    }

    debug('Executing query: ' + query.toString())

    const rawResult = await query
    let result = rawResult

    if (options.formatter) {
        result = options.formatter(rawResult)
    } else if (model) {
        // parse if it's a "getter" - ie is a select-query
        // else we format it to db-format
        if (isSelectQuery(query)) {
            result = model.parseDatabaseJson(result)
        } else {
            result = model.formatDatabaseJson(result)
        }
    }

    if (pager && pager.enabled) {
        if (options.pagingStrategy === pagingStrategies.SLICE) {
            result = pager.sliceAndFormatResult(result)
        } else {
            let totalCount = 0
            if (
                rawResult.length > 0 &&
                options.pagingStrategy === pagingStrategies.WINDOW
            ) {
                totalCount = rawResult[0].total_count
            } else if (
                rawResult.length > 0 &&
                options.pagingStrategy === pagingStrategies.SEPARATE
            ) {
                const countQuery = pager.getTotalCountQuery(query)
                debug('Executing totalCount-query', countQuery.toString())
                const totalRes = await countQuery
                totalCount = totalRes.total_count
            }
            result = pager.formatResult(result, totalCount)
        }
    } else {
        // keep same API if no pager
        result = {
            result,
        }
    }

    return result
}

module.exports = {
    executeQuery,
    pagingStrategies,
}
