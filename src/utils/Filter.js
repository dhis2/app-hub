const Joi = require('@hapi/joi')
const debug = require('debug')('apphub:server:utils:Filter')

const SEPERATOR_CHAR = ':'

const operatorMap = {
    eq: '=',
    ilike: 'ilike',
    like: 'like',
}

const toSQLOperator = operatorStr => {
    const operator = operatorMap[operatorStr]
    if (!operator) {
        throw new Error('Operator ', operatorStr, ' not supported.')
    }
    return operator
}

const applyFiltersToQuery = (filters, query, { tableName, columnMap }) => {
    for (k in filters) {
        const colName = columnMap ? columnMap[k] : k
        if (colName) {
            query.where(
                tableName ? `${tableName}.${colName}` : colName,
                '=',
                filters[k]
            )
        }
    }
    return
}

const parseFilterString = filterStr => {
    let operator
    const seperatorIdx = filterStr.indexOf(SEPERATOR_CHAR)
    if (seperatorIdx < 0) {
        operator = '='
    } else {
        const operatorStr = filterStr.substring(0, seperatorIdx)
        operator = toSQLOperator(operatorStr)
    }
    const value = filterStr.substring(seperatorIdx + 1)

    return {
        value,
        operator,
    }
}

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
     * @param {*} validation
     * @param {Object} options options object merged with the object passed to `applyToQuery`
     */
    constructor(filters = {}, validation, options = {}) {
        // filters before validation
        this.originalFilters = filters
        this.validation = validation
        this.options = {}
        this.renamedMap = {} //map of renames, from -> to
        this.marked = new Set()
        this.filters = this.validate(validation, filters)
    }

    /**
     *
     * @param {*} filters an object with filters, where the key is the field name, value is a filter-string, like
     * `eq:DHIS2`.
     *
     * @param {*} validation a joi validation object or a validation function with the signature `function(filters)`.
     * If a function is passed the filters
     *
     * @returns An instance of Filters, where the filters are validated/transformed using `validation`.
     */
    static createFromQueryFilters(filters, validation, options) {
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
        return new Filters(result, validation, options)
    }

    getFilter(field) {
        const key = renamedMap[field] || field
        return this.filters[key]
    }

    getFilterColumn(field) {
        return renamedMap[field] || field
    }

    validate(validation, filters = this.filters) {
        if (Joi.isSchema(validation)) {
            const result = {}

            const operators = {}
            let schemaDescription = null // schema.describe() is expensive so we don't call it unless needed

            // Transform to key: value to be able to validate with Joi
            const validationFilters = Object.keys(filters).reduce(
                (acc, curr) => {
                    const currFilter = filters[curr]
                    acc[curr] = currFilter.value
                    operators[curr] = currFilter.operator
                    return acc
                },
                {}
            )

            const validated = Joi.attempt(validationFilters, validation)

            // Transform back to filter with operator
            Object.keys(validated).forEach(key => {
                const val = validated[key]
                let operator = operators[key]
                if (!operator) {
                    //key renamed, find oldkey to get operator
                    if (!schemaDescription) {
                        schemaDescription = validation.describe()
                    }
                    const renamed = schemaDescription.renames.find(
                        rename => rename.to === key
                    )
                    if (!renamed || !renamed.from || !operators[renamed.from]) {
                        throw new Error('Could not find renamed key!')
                    }
                    operator = operators[renamed.from]
                    this.renamedMap[renamed.from] = renamed.to
                }
                validated[key] = {
                    value: val,
                    operator,
                }
            })

            return validated
        } else if (typeof validation === 'function') {
            return validation(filters)
        } else {
            return filters
        }
    }

    toKeyValueMap() {}

    applyOneToQuery(query, field, options) {
        const colName = this.getFilterColumn(field)
        const filter = this.filter[filterKey]
        if (filter) {
            this.markApplied(field)
            query.where(
                options.tableName ? `${options.tableName}.${colName}` : colName,
                filter.operator,
                filter.value
            )
        } else {
            throw new Error(
                `Failed to apply filter to query, ${field} is not a valid filter.`
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
        for (colName in this.filters) {
            if (this.marked.has(k)) {
                continue
            }
            const { value, operator } = this.filter[colName]
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
