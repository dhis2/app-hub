const Lab = require('@hapi/lab')
const Joi = require('../../src/utils/CustomJoi')

const { it, describe, afterEach } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')
const sinon = require('sinon')
const appMocks = require('../../seeds/mock/apps')
const { executeQuery } = require('../../src/query/executeQuery')
const { Filters } = require('../../src/utils/Filter')
const { Pager } = require('../../src/query/Pager')

describe('executeQuery', () => {
    afterEach(() => {
        sinon.restore()
    })

    const appMocksWithTotal = appMocks.map(a => ({
        ...a,
        total_count: appMocks.length,
    }))
    const getQueryMock = new Promise(resolve => {
        resolve(appMocksWithTotal)
    })
    getQueryMock._method = 'select'

    const insertQueryMock = {
        then: () => appMocks,
        _method: 'insert',
    }

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
    }

    const filters = Filters.createFromQueryFilters({
        id: `eq:${appMocks[0].id}`,
    })

    const pager = new Pager({ paging: true, pageSize: 25, page: 1 })

    it('should execute the query and return result', async () => {
        const result = await executeQuery(getQueryMock)

        expect(result).to.shallow.equal(appMocksWithTotal)
    })

    it('should execute the query and format it if options.formatter is present', async () => {
        const formatter = apps => apps.map(a => a.id)
        const formatterSpy = sinon.spy(formatter)
        const result = await executeQuery(getQueryMock, undefined, {
            formatter: formatterSpy,
        })

        expect(result).to.not.shallow.equal(appMocksWithTotal)
        expect(formatterSpy.calledOnce).to.be.true()
        result.forEach(a => {
            expect(a).to.not.be.an.object()
            expect(a).to.be.a.string()
        })
    })

    it('should use parseDatabaseJson if model is present', async () => {
        sinon.spy(appModelMock, 'parseDatabaseJson')
        const result = await executeQuery(getQueryMock, { model: appModelMock })

        expect(result).to.be.an.array()
        expect(
            appModelMock.parseDatabaseJson.calledWith(appMocksWithTotal)
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

        expect(result).to.not.shallow.equal(appMocksWithTotal)
        expect(formatterSpy.calledWith(appMocksWithTotal)).to.be.true()
        expect(appModelMock.parseDatabaseJson.notCalled).to.be.true()
    })

    it('should call filters.applyAllToQuery if filters is present', async () => {
        const funcStub = sinon.stub(filters, 'applyAllToQuery')
        const result = await executeQuery(getQueryMock, {
            filters,
        })

        expect(result).to.be.an.array()
        expect(funcStub.calledOnce).to.be.true()
        expect(funcStub.calledWith(getQueryMock)).to.be.true()
    })

    it('should call pager.applyToQuery and pager.formatResult if pager is present', async () => {
        const applyStub = sinon.stub(pager, 'applyToQuery')
        const formatResultStub = sinon
            .stub(pager, 'formatResult')
            .callsFake((result, len) => result)
        const result = await executeQuery(getQueryMock, {
            pager,
        })

        expect(result).to.be.an.array()
        expect(applyStub.calledOnce).to.be.true()
        expect(applyStub.calledWith(getQueryMock)).to.be.true()
        expect(
            formatResultStub.calledWith(appMocksWithTotal, appMocks.length)
        ).to.be.true()
    })

    it('should call both pager and filters if both are present', async () => {
        const pagerStub = sinon.stub(pager, 'applyToQuery')
        const formatResultStub = sinon
            .stub(pager, 'formatResult')
            .callsFake((result, total) => result)

        const filtersStub = sinon.stub(filters, 'applyAllToQuery')
        const result = await executeQuery(getQueryMock, {
            pager,
            filters,
        })
        expect(result).to.be.an.array()
        expect(filtersStub.calledOnce).to.be.true()
        expect(filtersStub.calledWith(getQueryMock)).to.be.true()

        expect(pagerStub.calledOnce).to.be.true()
        expect(pagerStub.calledWith(getQueryMock)).to.be.true()
        expect(
            formatResultStub.calledWith(appMocksWithTotal, appMocks.length)
        ).to.be.true()
    })

    it('should fallback to result.length if total_count is not present when calling pager.formatResult', async () => {
        const pagerStub = sinon.stub(pager, 'applyToQuery')
        const formatResultStub = sinon
            .stub(pager, 'formatResult')
            .callsFake((result, len) => result)

        const queryMock = new Promise(resolve => {
            resolve(appMocks)
        })
        const result = await executeQuery(queryMock, {
            pager,
        })

        expect(result).to.be.an.array()
        expect(
            formatResultStub.calledWith(appMocks, appMocks.length)
        ).to.be.true()
        expect(pagerStub.calledOnce).to.be.true()
        expect(pagerStub.calledWith(queryMock)).to.be.true()
    })
})
