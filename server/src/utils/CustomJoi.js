const Joi = require('joi')
const Bounce = require('@hapi/bounce')
const { parseFilterString, allOperatorsMap } = require('./filterUtils')

const defaultOperatorsSchema = Joi.string().valid(
    ...Object.keys(allOperatorsMap)
)
const defaultValueSchema = Joi.string()

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
const Filter = {
    type: 'filter',
    messages: {
        'filter.base': '{{#label}} is not a valid filter',
        'filter.string': '{{#label}} must be a string',
        'filter.value': 'value not valid in filter {{#label}}: {{#err}}',
        'filter.operator':
            'operator in filter "{{#label}}" not valid: {{#err}}',
        'filter.operatorValue':
            'value not valid for operator [{{#operator}}] in filter {{#label}}: {{#err}}',
    },
    flags: {
        operator: {
            default: defaultOperatorsSchema,
        },
        value: {
            default: defaultValueSchema,
        },
    },
    terms: {
        operatorValues: { init: [] },
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

        let valueSchema = helpers.schema._flags.value || defaultValueSchema
        const operatorSchema =
            helpers.schema._flags.operator || defaultOperatorsSchema

        const operatorValue = helpers.schema.$_terms.operatorValues.find(
            ({ operator: op }) => op === filter.operator
        )
        // use operatorValue() over .value() schema if it exists
        valueSchema = operatorValue ? operatorValue.valueSchema : valueSchema

        // Internal validate needed to pass down the state, which is used to generate correct error-message
        // eg. showing the correct key
        const valueResult = valueSchema.$_validate(
            filter.value,
            helpers.state,
            helpers.prefs
        )
        result.value = valueResult.value

        if (valueResult.errors) {
            const errorMessage = operatorValue
                ? 'filter.operatorValue'
                : 'filter.value'
            const errs = valueResult.errors.map((e) =>
                helpers.error(errorMessage, {
                    err: e,
                    operator: filter.operator,
                })
            )
            errors.push(...errs)
        }

        const opResult = operatorSchema
            .label('operator')
            .$_validate(filter.operator, helpers.state, helpers.prefs)
        result.operator = opResult.value

        if (opResult.errors) {
            const errs = opResult.errors.map((e) =>
                helpers.error('filter.operator', { err: e })
            )
            errors.push(...errs)
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
                    throw new Error('Value must be a schema')
                }
                const obj = this.$_setFlag('value', value)
                return obj
            },
        },

        operator: {
            method(value = defaultOperatorsSchema) {
                if (!Joi.isSchema(value)) {
                    throw new Error('Operator must be a schema')
                }
                return this.$_setFlag('operator', value)
            },
        },
        operatorValue: {
            method(operator, valueSchema) {
                console.log({ operator, valueSchema })
                if (!Joi.isSchema(valueSchema)) {
                    throw new Error('valueSchema must be a schema')
                }
                const operatorSchema = this.$_getFlag('operator')

                // check that operator is valid
                Joi.assert(operator, operatorSchema)

                const obj = this.clone()
                // $_terms is used to store "custom"-data for the schema
                obj.$_terms.operatorValues.push({ operator, valueSchema })
                // need to call this when internal state is changed (eg. $_terms)
                return obj.$_mutateRebuild()
            },
        },
    },
}

const StringArray = {
    base: Joi.array(),
    type: 'stringArray',
    coerce: (value, state, options) => ({
        value: value.split ? value.split(',') : value,
    }),
}

const ExtendedJoi = Joi.extend(StringArray).extend(Filter)
// supports single versions and a list of versions
// 2.34 and 2.34,2.35,2.36

module.exports = ExtendedJoi
