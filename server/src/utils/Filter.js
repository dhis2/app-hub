const Joi = require('./CustomJoi')
const { parseFilterString, toSQLOperator } = require('./filterUtils')
const debug = require('debug')('apphub:server:utils:Filter')

class Filters {
    /**
     *
     * Encapsulates logic related to filtering. Uses a query-filter object that can be applied
     * to a knex-query with applyAllToQuery() or applyOneToQuery()
     *
     * If renames are used, all interfacing field-names should use the 'original-name', that is the name before
     * renames. This is so that all application-logic uses the original-name instead of the internal database column-name
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
        this.options = options
        this.renameMap = renameMap || {} //map of renames, from -> to
        this.appliedFilters = new Set()
        this.filters = filters // keys are before-renames
    }

    /**
     * Parses an object with query-filters and creates an instance of Filters.
     *
     * Note that this is not normally used in routes. That creation is done
     * in queryFilter-plugin, and validation is done by hapi through normal query-validation.
     * This can however be used as a helper to create an instance of Filters outside of the normal flow.
     * Eg. in tests.
     *
     * @param {Object} filters an object with filters, where the key is the field name, value is a filter-string, like
     * `eq:DHIS2`.
     *
     * @param {Object} creationOptions an object with keys
     * @param {Joi.schema} creationOptions.validate a Joi-schema used to validate and transform the filters-object.
     * @param {Joi.schema || Object} creationOptions.rename A Joi-schema or a rename-object where the keys are the from-name and values are the
     * database column-name. If a Joi-schema it should have .rename() called on the schema. This is not used to validate,
     * and is supported to act as a shorthand to pass in renames from an already defined Joi 'Model'-schema.
     * @param {*} options a Joi-configuration passed to Joi.attempt() when validating
     *
     * @returns An instance of Filters, where the filters are validated/transformed using `validation`.
     */
    static createFromQueryFilters(filters, { validate, rename } = {}, options) {
        let result = filters
        let renameMap = null
        Object.keys(filters).map(key => {
            try {
                const filter = parseFilterString(filters[key])
                result[key] = filter
            } catch (e) {
                debug('Failed to parse filter', e)
                throw Error(`Failed to parse filter for ${key}`)
            }
            return result
        })
        if (validate && Joi.isSchema(validate)) {
            result = Joi.attempt(filters, validate, {
                convert: false, //don't convert, this is done above in parseFilterString
                ...options,
            })
        }
        if (rename) {
            if (Joi.isSchema(rename)) {
                const renames = rename.describe().renames
                if (renames) {
                    renameMap = renames.reduce((acc, curr) => {
                        const { from, to } = curr
                        acc[from] = to
                        return acc
                    }, {})
                }
            } else {
                renameMap = rename
            }
        }
        return new Filters(result, { renameMap }, options)
    }

    getFilter(fieldName) {
        return this.filters[fieldName]
    }

    getFilterColumn(fieldName) {
        return this.renameMap[fieldName] || fieldName
    }

    isEmpty() {
        return Object.keys(this.filters).length < 1
    }

    hasFilters() {
        return !this.isEmpty()
    }

    /**
     * Applies the filter
     * @param {*} query
     * @param {*} fieldName
     * @param {*} options
     */

    applyOneToQuery(query, fieldName, options) {
        const colName = this.getFilterColumn(fieldName)
        const filter = this.filter[fieldName]
        if (filter) {
            this.markApplied(fieldName)
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

    /**
     * Marks the filter as applied. Can be useful when creating a custom query,
     * and you don't want the filter to be applied when running applyAllToQuery().
     *
     * @param {*} field field to mark as applied. The field is ignored
     */
    markApplied(field) {
        this.appliedFilters.add(field)
    }

    /**
     * Applies all internal filters to the knex-query.
     * The query might fail if the filter-value is incompatible with the database-column type.
     *
     * @param {*} query knex query-builder-instance to add a where-clause(s) to.
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
