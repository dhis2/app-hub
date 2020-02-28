const Joi = require('./CustomJoi')
const { parseFilterString, toSQLOperator } = require('./filterUtils')
const debug = require('debug')('apphub:server:utils:Filter')

class Filters {
    /**
     *
     * @param {*} filters an object where the key is the field name of the filter, value is an object of shape
     * {
     *  value - the value of the filter,
     *  operator = the database-operator of the filter
     *
     * }
     * @param {*} validationObject - ValidationObj
     * @param {Object} options options object merged with the object passed to `applyToQuery`
     */
    constructor(filters = {}, { renameMap } = {}, options = {}) {
        // filters before validation
        this.originalFilters = filters
        this.options = options
        this.renameMap = renameMap //map of renames, from -> to
        this.appliedFilters = new Set()
        this.filters = filters
    }

    /**
     *
     * @param {*} filters an object with filters, where the key is the field name, value is a filter-string, like
     * `eq:DHIS2`.
     *
     * @param {*} validate a joi validation schema
     *
     * @returns An instance of Filters, where the filters are validated/transformed using `validation`.
     */
    static createFromQueryFilters(filters, validate, options) {
        const result = {}

        Object.keys(filters).map(key => {
            try {
                const filter = parseFilterString(filters[key])
                result[key] = filter
            } catch (e) {
                debug('Failed to parse filter', e)
                throw Error(`Failed to parse filter for ${key}`)
            }
        })
        const validated = Joi.attempt(result, validate, options)
        const renameMap = validated.renames.reduce((acc, curr) => {
            const { from, to } = curr
            acc[from] = to
            return acc
        }, {})
        return new Filters(validated, { renameMap }, options)
    }

    getFilter(field) {
        return this.filters[field]
    }

    getFilterColumn(field) {
        return this.renameMap[field] || field
    }

    isEmpty() {
        return Object.keys(this.filters).length < 1
    }

    hasFilters() {
        return !this.isEmpty()
    }

    applyOneToQuery(query, field, options) {
        const colName = this.getFilterColumn(field)
        const filter = this.filter[field]
        if (filter) {
            this.markApplied(field)
            query.where(
                options.tableName ? `${options.tableName}.${colName}` : colName,
                toSQLOperator(filter.operator),
                filter.value
            )
        } else {
            throw new Error(
                `Failed to apply filter to query, ${colName} is not a valid filter.`
            )
        }
    }

    markApplied(field) {
        this.appliedFilters.add(field)
    }

    /**
     *
     * @param {*} query knex query-builder-instance to add a where-clause to.
     * @param {*} options options object, merged with the one given to the Filters instance.
     * @param {string} options.tableName
     */
    applyAllToQuery(query, options = {}) {
        const settings = {
            ...this.options,
            ...options,
        }
        for (const filterName in this.filters) {
            const colName = this.getFilterColumn(filterName)
            const { value, operator } = this.filters[filterName]

            if (this.appliedFilters.has(filterName)) {
                continue
            }
            query.where(
                settings.tableName
                    ? `${settings.tableName}.${colName}`
                    : colName,
                toSQLOperator(operator),
                value
            )
        }
        this.appliedFilters.clear()
    }
}

module.exports = {
    Filters,
}
