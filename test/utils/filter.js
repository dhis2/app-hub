const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const {
    it,
    describe,
    afterEach,
    beforeEach,
    before,
    after,
} = (exports.lab = Lab.script())
const Joi = require('@hapi/joi')
const { Filters } = require('../../src/utils/Filter')
const { ValidationError } = require('@hapi/joi')

const OrgModel = require('../../src/models/v2/Organisation')

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
                operator: '=',
            })

            expect(filters.filters).to.include(['owner'])
        })

        it('should throw if operator is unsupported', () => {
            const queryFilters = {
                name: 'eq:DHIS2',
                owner: 'in:DHIS2',
            }
            const func = Filters.createFromQueryFilters.bind(null, queryFilters)
            expect(func).to.throw(Error, 'Failed to parse filter for owner')
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
                operator: '=',
            })

            expect(filters.filters.owner).to.be.equal({
                value: 'test',
                operator: '=',
            })
        })
    })

    describe('with validation', () => {
        it('should successfully validate', () => {
            const queryFilters = {
                name: 'eq:DHIS2',
            }
            const schema = Joi.object({
                name: Joi.string(),
            })

            const filters = Filters.createFromQueryFilters(queryFilters, schema)

            expect(filters).to.be.instanceOf(Filters)
            expect(filters.filters.name).to.be.equal({
                value: 'DHIS2',
                operator: '=',
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
                created_by_user_id: Joi.string().guid(),
            }).rename('owner', 'created_by_user_id')

            const filters = Filters.createFromQueryFilters(queryFilters, schema)
            expect(filters.filters.created_by_user_id).to.be.an.object()
            expect(filters.filters.owner).to.be.undefined()
        })

        it('should be able to use Model as a base', () => {
            const schema = OrgModel.dbDefinition

            const queryFilters = {
                name: 'eq:DHIS2',
                owner: 'eq:58262f57-4f38-45c5-a3c2-9e30ab3ba2da',
                test: 'asf',
            }

            const filters = Filters.createFromQueryFilters(queryFilters, schema)
            expect(filters.filters).to.be.an.object()
            expect(filters.filters).to.include(['name', 'created_by_user_id'])
        })
    })
})
