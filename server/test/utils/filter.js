const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const { it, describe } = (exports.lab = Lab.script())
const Joi = require('../../src/utils/CustomJoi')
const { Filters } = require('../../src/utils/Filter')
const { ValidationError } = require('@hapi/joi')

describe('Filters', () => {
    describe('createFromQueryFilters', () => {
        it('should parse and create an instance of Filters', () => {
            const queryFilters = {
                name: 'eq:DHIS2',
                owner: 'like:DHIS2',
            }
            const filters = Filters.createFromQueryFilters(queryFilters)

            expect(filters).to.be.instanceOf(Filters)
            expect(filters.filters).to.be.an.object()
            expect(filters.filters.name).to.be.equal({
                value: 'DHIS2',
                operator: 'eq',
            })

            expect(filters.filters).to.include(['owner'])
        })

        it('should work with simple filters and fallback to equals', () => {
            const queryFilters = {
                name: 'DHIS2',
                owner: 'test',
            }

            const filters = Filters.createFromQueryFilters(queryFilters)
            expect(filters).to.be.instanceOf(Filters)
            expect(filters.filters).to.be.an.object()
            expect(filters.filters.name).to.be.equal({
                value: 'DHIS2',
                operator: 'eq',
            })

            expect(filters.filters.owner).to.be.equal({
                value: 'test',
                operator: 'eq',
            })
        })
    })

    describe('with validation', () => {
        it('should successfully validate', () => {
            const queryFilters = {
                name: 'eq:DHIS2',
            }
            const schema = Joi.object({
                name: Joi.filter(),
            })

            const filters = Filters.createFromQueryFilters(queryFilters, schema)

            expect(filters).to.be.instanceOf(Filters)
            expect(filters.filters.name).to.be.equal({
                value: 'DHIS2',
                operator: 'eq',
            })
        })

        it('should throw Joi ValidationError if validation fails', () => {
            const queryFilters = {
                name: 'eq:DHIS2',
            }
            const schema = Joi.object({
                name: Joi.number(),
            })

            const throws = () => {
                Filters.createFromQueryFilters(queryFilters, schema)
            }
            expect(throws).to.throw(ValidationError, '"name" must be a number')
        })

        it('should support rename of keys', () => {
            const queryFilters = {
                owner: 'eq:58262f57-4f38-45c5-a3c2-9e30ab3ba2da',
            }
            const schema = Joi.object({
                created_by_user_id: Joi.filter(Joi.string().guid()),
            }).rename('owner', 'created_by_user_id')

            const filters = Filters.createFromQueryFilters(queryFilters, schema)
            expect(filters.filters.created_by_user_id).to.be.an.object()
            expect(filters.filters.owner).to.be.undefined()
        })
    })
})
