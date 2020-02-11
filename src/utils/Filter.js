const Joi = require('./CustomJoi')
const { parseFilterString } = require('./filterUtils')
const debug = require('debug')('apphub:server:utils:Filter')

class Filter {
    constructor(field, value, operator = '=') {
        this.originalField = field
        this.column = field
        this.value = value
        this.operator = operator
    }

    static createFromFilterString(field, filterStr) {
        const { value, operator } = this.parseFilterString(filterStr)
        return new Filter(field, value, operator)
    }

    static parseFilterString(filterStr) {
        let operator
        const seperatorIdx = filterStr.indexOf(SEPERATOR_CHAR)
        if (seperatorIdx < 0) {
            operator = '='
        } else {
            const operatorStr = filterStr.substring(0, seperatorIdx)
            operator = toSQLOperator(operatorStr)
        }
        const value = filterStr.substring(seperatorIdx + 1)
        if (!value) {
            throw new Error('Filter value cannot be empty')
        }
        return {
            value,
            operator,
        }
    }

    applyToQuery(query, { tableName }) {
        const colName = this.field
        if (colName) {
            query.where(
                tableName ? `${tableName}.${colName}` : colName,
                this.operator,
                this.value
            )
        }
    }
}

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
    constructor(filters = {}, { description, validate }, options = {}) {
        // filters before validation
        this.originalFilters = filters
        this.validation = validate
        this.options = {}
        this.renamedMap = {} //map of renames, from -> to
        this.marked = new Set()
        this.filters = filters //this.validate(validation, filters)

        if (description && description.renames) {
            description.renames.forEach(r => {
                this.renamedMap[r.from] = r.to
            })
        }
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
        return new Filters(
            validated,
            { validate, description: validate.describe() },
            options
        )
    }

    getFilter(field) {
        const key = this.renamedMap[field] || field
        return this.filters[key]
    }

    getFilterColumn(field) {
        return this.renamedMap[field] || field
    }

    isEmpty() {
        return Object.keys(this.filters).length < 1
    }

    hasFilters() {
        return !this.isEmpty()
    }

    applyOneToQuery(query, field, options) {
        const colName = this.getFilterColumn(field)
        const filter = this.filter[colName]
        if (filter) {
            this.markApplied(field)
            query.where(
                options.tableName ? `${options.tableName}.${colName}` : colName,
                filter.operator,
                filter.value
            )
        } else {
            throw new Error(
                `Failed to apply filter to query, ${colName} is not a valid filter.`
            )
        }
    }

    markApplied(field) {
        const key = this.getFilterColumn(field)
        if (key) {
            this.marked.add(key)
        }
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
        for (const colName in this.filters) {
            if (this.marked.has(colName)) {
                continue
            }
            const { value, operator } = this.filters[colName]
            query.where(
                options.tableName ? `${options.tableName}.${colName}` : colName,
                operator,
                value
            )
        }
        this.marked.clear()
    }
}

module.exports = {
    Filter,
    Filters,
}
