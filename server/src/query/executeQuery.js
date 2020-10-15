/**
 * Executes the knex-query, applying filters and paging if present
 *
 * @param {*} query the base knex-query reference
 * @param {*} queryHelper
 * @param {*} queryHelpers.filters an instance of Filters that can be used to applied filters
 * @param {*} queryHelpers.pager an instance of Pager that can be used to apply pagination to query
 * @param {*} queryHelpers.model a "model" object that can be used to format the output.
 * @param {*} options Options object
 * @param {*} options.formatter a function that overrides format-logic from model, gets the result and should return formatted result
 */
async function executeQuery(query, { filters, pager, model }, options = {}) {
    if (filters) {
        filters.applyAllToQuery(query)
    }

    if (pager) {
        pager.applyToQuery(query)
    }

    // actually run query
    const rawResult = await query
    let result = rawResult

    if (model) {
        if (options.formatter) {
            result = options.formatter(rawResult)
        } else {
            // parse if it's a "getter" - ie is a select-query
            // else we format it do db-format
            if (query._method === 'select') {
                result = model.parseDatabaseJson(result)
            } else {
                result = model.formatDatabaseJson(result)
            }
        }
    }

    if (pager) {
        const totalCount = rawResult.length > 0 ? rawResult[0].total_count : 0
        result = pager.formatResult(result, totalCount)
    }

    return result
}

module.exports = {
    executeQuery,
}
