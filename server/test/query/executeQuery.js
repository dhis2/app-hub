const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const Knex = require('knex')
const sinon = require('sinon')
const { it, describe, afterEach, beforeEach } = (exports.lab = Lab.script())
const knexConfig = require('../../knexfile')
const appMocks = require('../../seeds/mock/apps')
const organisationMocks = require('../../seeds/mock/organisations')
const {
    executeQuery,
    pagingStrategies,
} = require('../../src/query/executeQuery')
const { Pager } = require('../../src/query/Pager')
const Joi = require('../../src/utils/CustomJoi')
const { Filters } = require('../../src/utils/Filter')

const dbInstance = Knex(knexConfig)
describe('executeQuery', () => {
    let db

    beforeEach(async () => {
        db = await dbInstance.transaction()
    })

    afterEach(async () => {
        sinon.restore()
        await db.rollback()
    })

    const appMocksWithTotal = appMocks.map(a => ({
        ...a,
        total_count: appMocks.length,
    }))

    const organisationQuery = dbInstance('organisation').select(
        'organisation.id',
        'organisation.name',
        'organisation.email',
        'organisation.slug',
        'organisation.created_by_user_id',
        'organisation.updated_at',
        'organisation.created_at'
    )

    const getQueryMock = new Promise(resolve => {
        resolve(appMocksWithTotal)
    })
    getQueryMock._method = 'select'

    const insertQueryMock = new Promise(resolve => resolve(appMocksWithTotal))
    insertQueryMock._method = 'insert'

    const appDefinition = Joi.object({
        id: Joi.string(),
        organisation: Joi.string(),
        owner: Joi.string(),
        type: Joi.string(),
        developer: Joi.string(),
    })
        .rename('organisation_id', 'organisation')
        .rename('created_by_user_id', 'owner')
        .rename('developer_user_id', 'developer')
        .prefs({ stripUnknown: true })

    const appModelMock = {
        definition: appDefinition,
        parseDatabaseJson: apps =>
            Joi.attempt(apps, Joi.array().items(appDefinition)),
        formatDatabaseJson: apps =>
            Joi.attempt(apps, Joi.array().items(appDefinition)),
    }

    const filters = Filters.createFromQueryFilters({
        id: `eq:${appMocks[0].id}`,
    })

    const pager = new Pager({ paging: true, pageSize: 25, page: 1 })

    it('should execute the query and return result', async () => {
        const result = await executeQuery(organisationQuery)

        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array().length(organisationMocks.length)
        result.result.forEach(org => {
            expect(
                organisationMocks.find(o => o.id === org.id)
            ).to.not.be.undefined()
        })
    })

    it('should execute the query and format it if options.formatter is present', async () => {
        const formatter = apps => apps.map(a => a.id)
        const formatterSpy = sinon.spy(formatter)
        const result = await executeQuery(getQueryMock, undefined, {
            formatter: formatterSpy,
        })

        expect(result).to.be.an.object()
        expect(result.result).to.not.shallow.equal(appMocksWithTotal)
        expect(formatterSpy.calledOnce).to.be.true()
        result.result.forEach(a => {
            expect(a).to.not.be.an.object()
            expect(a).to.be.a.string()
        })
    })

    it('should use parseDatabaseJson if model is present', async () => {
        sinon.spy(appModelMock, 'parseDatabaseJson')
        const result = await executeQuery(getQueryMock, { model: appModelMock })

        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array()
        expect(
            appModelMock.parseDatabaseJson.calledWith(appMocksWithTotal)
        ).to.be.true()
    })

    it('should use formatDatabaseJson if insert query', async () => {
        sinon.spy(appModelMock, 'formatDatabaseJson')
        const result = await executeQuery(insertQueryMock, {
            model: appModelMock,
        })

        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array()
        expect(
            appModelMock.formatDatabaseJson.calledWith(appMocksWithTotal)
        ).to.be.true()
    })

    it('should prioritise formatter if both model and options.formatter is present', async () => {
        sinon.spy(appModelMock, 'parseDatabaseJson')
        const formatter = apps => apps.map(a => a.id)
        const formatterSpy = sinon.spy(formatter)
        const result = await executeQuery(
            getQueryMock,
            { model: appModelMock },
            {
                formatter: formatterSpy,
            }
        )

        expect(result).to.be.an.object()
        expect(result.result).to.not.shallow.equal(appMocksWithTotal)
        expect(formatterSpy.calledWith(appMocksWithTotal)).to.be.true()
        expect(appModelMock.parseDatabaseJson.notCalled).to.be.true()
    })

    it('should call filters.applyAllToQuery if filters is present', async () => {
        const funcStub = sinon.stub(filters, 'applyAllToQuery')
        const result = await executeQuery(getQueryMock, {
            filters,
        })

        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array()
        expect(funcStub.calledOnce).to.be.true()
        expect(funcStub.calledWith(getQueryMock)).to.be.true()
    })

    it('should call pager.applyToQuery and pager.formatResult if pager is present', async () => {
        const applyStub = sinon.stub(pager, 'applyToQuery')
        const formatResultSpy = sinon.spy(pager, 'formatResult')

        const result = await executeQuery(organisationQuery, {
            pager,
        })

        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array()
        expect(applyStub.calledOnce).to.be.true()
        expect(applyStub.calledWith(organisationQuery, true)).to.be.true()
        expect(formatResultSpy.called).to.be.true()
    })

    it('should call both pager and filters if both are present', async () => {
        const pagerStub = sinon.stub(pager, 'applyToQuery')

        const formatResultSpy = sinon.spy(pager, 'formatResult')

        const filtersStub = sinon.stub(filters, 'applyAllToQuery')
        const result = await executeQuery(organisationQuery, {
            pager,
            filters,
        })
        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array()
        expect(filtersStub.calledOnce).to.be.true()
        expect(filtersStub.calledWith(organisationQuery)).to.be.true()

        expect(pagerStub.calledOnce).to.be.true()
        expect(pagerStub.calledWith(organisationQuery, true)).to.be.true()
        expect(formatResultSpy.called).to.be.true()
    })

    it('should return formatted result', async () => {
        const oneItemPager = new Pager({ paging: true, pageSize: 1, page: 1 })
        const result = await executeQuery(organisationQuery, {
            pager: oneItemPager,
        })

        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array().length(1)
        expect(result.pager).to.exist()
    })

    it('should call getTotalCountQuery if pager is present and pagingStrategy is "separate"', async () => {
        const oneItemPager = new Pager({ paging: true, pageSize: 1, page: 1 })
        const totalCountQuerySpy = sinon.spy(oneItemPager, 'getTotalCountQuery')
        const result = await executeQuery(organisationQuery, {
            pager: oneItemPager,
            pagingStrategy: pagingStrategies.SEPARATE,
        })

        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array().length(1)
        expect(result.pager).to.exist()
        expect(totalCountQuerySpy.calledWith(organisationQuery)).to.be.true()
    })

    it('should call sliceAndFormatResult if pager is present and pagingStrategy is "slice"', async () => {
        const oneItemPager = new Pager({ paging: true, pageSize: 1, page: 1 })
        const sliceAndFormatResultSpy = sinon.spy(
            oneItemPager,
            'sliceAndFormatResult'
        )
        const result = await executeQuery(
            organisationQuery,
            {
                pager: oneItemPager,
            },
            { pagingStrategy: 'slice' }
        )

        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array().length(1)
        expect(result.pager).to.exist()
        expect(sliceAndFormatResultSpy.called).to.be.true()
    })

    it('should not call applyToQuery if pager is present and pagingStrategy is "slice"', async () => {
        const oneItemPager = new Pager({ paging: true, pageSize: 1, page: 1 })
        const applyToQuerySpy = sinon.spy(oneItemPager, 'applyToQuery')
        const result = await executeQuery(
            organisationQuery,
            {
                pager: oneItemPager,
            },
            { pagingStrategy: 'slice' }
        )

        expect(result).to.be.an.object()
        expect(result.result).to.be.an.array().length(1)
        expect(result.pager).to.exist()
        expect(applyToQuerySpy.called).to.be.false()
    })
})
