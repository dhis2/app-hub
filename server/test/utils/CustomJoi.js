const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const { it, describe } = (exports.lab = Lab.script())
const CustomJoi = require('../../src/utils/CustomJoi')

describe('CustomJoi', () => {
    it('should extend Joi with a filter method', () => {
        expect(CustomJoi.filter).to.be.a.function()
    })

    it('should extend Joi with a stringArray method', () => {
        expect(CustomJoi.stringArray).to.be.a.function()
    })

    it('should parse a filter string to a object with value and operator', () => {
        const filterString = 'eq:DHIS2'
        const schema = CustomJoi.filter()
        const filter = schema.validate(filterString)

        expect(filter).to.be.an.object()
        expect(filter.errors).to.be.undefined()

        const value = filter.value
        expect(value).to.include(['value', 'operator'])
        expect(value.value).to.be.equal('DHIS2')
        expect(value.operator).to.be.equal('eq')
    })

    describe('operator', () => {
        it('should validate operator according to schema', () => {
            const filterString = 'eq:DHIS2'
            const schema = CustomJoi.filter().operator(
                CustomJoi.string().valid(...['eq'])
            )
            const filter = schema.validate(filterString)

            expect(filter).to.be.an.object()
            expect(filter.error).to.be.undefined()
        })

        it('should validate operator and return error if invalid', () => {
            const filterString = 'ne:DHIS2'
            const schema = CustomJoi.filter().operator(
                CustomJoi.string().valid(...['in'])
            )
            const filter = schema.validate(filterString)

            expect(filter).to.be.an.object()
            expect(filter.error).to.be.an.error()
        })

        it('should default to eq if no operator is provided in filter', () => {
            const filterString = 'DHIS2'
            const schema = CustomJoi.filter()
            const filter = schema.validate(filterString)

            expect(filter).to.be.an.object()
            expect(filter.error).to.be.undefined()
            expect(filter.value).to.include(['value', 'operator'])
            expect(filter.value.value).to.be.equal('DHIS2')
            expect(filter.value.operator).to.be.equal('eq')
        })

        it('should default to common operators if no operator is set for filter-schema', () => {
            const filterString = 'ne:DHIS2'
            const schema = CustomJoi.filter()
            const filter = schema.validate(filterString)

            expect(filter).to.be.an.object()
            expect(filter.error).to.be.undefined()
            expect(filter.value).to.include(['value', 'operator'])
            expect(filter.value.value).to.be.equal('DHIS2')
            expect(filter.value.operator).to.be.equal('ne')

            const invalidFilter = 'notIn:DHIS2'
            const invalid = schema.validate(invalidFilter)
            expect(invalid.error).to.be.an.error()
        })
    })

    describe('value()', () => {
        it('should validate filter-value according to value-schema', () => {
            const filterString = 'eq:DHIS2'
            const schema = CustomJoi.filter().value(
                CustomJoi.string().valid('DHIS2')
            )
            const validatedFilter = schema.validate(filterString)

            expect(validatedFilter).to.be.an.object()
            expect(validatedFilter.error).to.be.undefined()
            expect(validatedFilter.value).to.include(['value', 'operator'])

            const filterInvalid = schema.validate('eq:NotDHIS2')
            expect(filterInvalid).to.be.an.object()
            expect(filterInvalid.error).to.be.an.error()
        })
        it('should throw an error if arg is not a Joi-schema', () => {
            const toThrow = () => CustomJoi.filter().value('DHIS2')
            expect(toThrow).to.throw()
        }),
            it('should validate value if filter is called with a schema', () => {
                const filterString = 'eq:NotDHIS2'
                const schema = CustomJoi.filter(
                    CustomJoi.string().valid(...['DHIS2'])
                )
                const filter = schema.validate(filterString)

                expect(filter).to.be.an.object()
                expect(filter.error).to.be.an.error()
            })
        it('should apply value schema only to operators in options.operators if set', () => {
            const filterString = 'eq:DHIS2'
            const schema = CustomJoi.filter().value(
                CustomJoi.string().valid(...['DHIS2']),
                { operators: ['eq', 'in'] }
            )
            const filter = schema.validate(filterString)

            expect(filter).to.be.an.object()
            expect(filter.error).to.be.undefined()
            expect(filter.value).to.be.an.object()

            // should not fail since operator is not éq'
            const filterString2 = 'ne:NotDHIS2'

            const filter2 = schema.validate(filterString2)

            expect(filter2).to.be.an.object()
            expect(filter2.error).to.be.undefined()
            expect(filter2.value).to.be.an.object()

            const filterInvalid = schema.validate('eq:NotDHIS2')
            expect(filterInvalid).to.be.an.object()
            expect(filterInvalid.error).to.be.an.error()
        })
    })
})
