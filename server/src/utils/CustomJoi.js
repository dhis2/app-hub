const Joi = require('@hapi/joi')
const Bounce = require('@hapi/bounce')
const { parseFilterString, allOperatorsMap } = require('./filterUtils')

const stringOperatorSchema = Joi.string().valid(...Object.keys(allOperatorsMap))

/**
 * Adds filter as a new type in Joi.
 * This is used to parse and validate filters like 'operator:value'.
 * If prefs.convert is true (default), it will transform the value to a Filter-object,
 * of shape
 *  {
 *      operator: string,
 *      value: string
 * }
 *
 * Usage:
 * CustomJoi.filter(valueSchema)
 * CustomJoi.filter().value(valueSchema)
 *  * valueSchema - The Joi-schema that the value part of the filter should be validated against
 *
 * CustomJoi.operator(operatorSchema)
 *  * operatorSchema - The Joi-schema that the operator part of the filter should be validated against
 */
const FilterJoi = Joi.extend({
    type: 'filter',
    messages: {
        'filter.base': '{{#label}} is not a valid filter',
        'filter.string': '{{#label}} must be a string',
        'filter.value': 'value in filter "{{#label}}" not valid: {{#err}}',
        'filter.operator':
            'operator in filter "{{#label}}" not valid: {{#err}}',
    },
    args(schema, arg) {
        return schema.value(arg)
    },
    coerce: {
        method(value, helpers) {
            if (typeof value !== 'string') {
                return { value, errors: helpers.error('filter.string') }
            }
            try {
                const parsed = parseFilterString(value)
                return { value: parsed }
            } catch (ignoreErr) {
                Bounce.rethrow(ignoreErr, 'system')
            }
        },
    },
    validate(filter, helpers) {
        if (!filter || !filter.value || !filter.operator) {
            return { value: filter, errors: helpers.error('filter.base') }
        }
        const result = { ...filter }
        const errors = []

        const valueSchema = helpers.schema._flags.value || Joi.string()
        const operatorSchema =
            helpers.schema._flags.operator || stringOperatorSchema

        if (valueSchema) {
            // Internal validate needed to pass down the state, which is used to generate correct error-message
            // eg. showing the correct key
            const valueResult = valueSchema
                .label('value')
                .$_validate(filter.value, helpers.state, helpers.prefs)
            result.value = valueResult.value

            if (valueResult.errors) {
                const errs = valueResult.errors.map(e =>
                    helpers.error('filter.value', { err: e })
                )
                errors.push(...errs)
            }
        }
        if (operatorSchema) {
            const opResult = operatorSchema
                .label('operator')
                .$_validate(filter.operator, helpers.state, helpers.prefs)
            result.operator = opResult.value
            if (opResult.errors) {
                const errs = opResult.errors.map(e =>
                    helpers.error('filter.operator', { err: e })
                )
                errors.push(...errs)
            }
        }

        return {
            value: result,
            errors,
        }
    },

    rules: {
        value: {
            method(value = Joi.string()) {
                if (!Joi.isSchema(value)) {
                    return this.error(new Error('Value must be a schema'))
                }
                const obj = this.$_setFlag('value', value)
                return obj
            },
        },

        operator: {
            method(value) {
                if (!Joi.isSchema(value)) {
                    return this.error(new Error('Operator must be a schema'))
                }
                return this.$_setFlag('operator', value)
            },
        },
    },
})

const StringArrayJoi = Joi.extend({
    base: Joi.array(),
    type: 'stringArray',
    coerce: (value, state, options) => ({
        value: value.split ? value.split(',') : value
    })
})

exports = module.exports = FilterJoi
exports.FilterJoi = FilterJoi
exports.StringArrayJoi = StringArrayJoi
