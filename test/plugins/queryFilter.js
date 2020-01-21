const Lab = require('@hapi/lab')
const { it, describe, before } = (exports.lab = Lab.script())
const { expect, fail } = require('@hapi/code')
const { flatten } = require('../../src/utils')
const {
    UniqueViolationError,
    ForeignKeyViolationError,
    NotNullViolationError,
    CheckViolationError,
    DBError,
    DataError,
    ConstraintViolationError,
} = require('db-errors')
const { NotFoundError } = require('../../src/utils/errors')
const QueryFilterPlugin = require('../../src/plugins/queryFilter')
const Joi = require('@hapi/joi')
const Hapi = require('@hapi/hapi')

describe('QueryFilterPlugin', () => {
    let server
    before(async () => {
        server = Hapi.server({ port: 3001 })
        await server.register({ plugin: QueryFilterPlugin })

        server.route({
            method: 'GET',
            path: '/filter',
            config: {
                plugins: {
                    queryFilter: {
                        enabled: true,
                    },
                },
            },
            handler: (request, h) => {
                const filters = request.query.filters
                return filters
            },
        })
    })

    it('it should parse query-params into filters-object', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/filter?name=eq:DHIS2',
        })
        expect(res.statusCode).to.be.equal(200)
        const query = res.request.query
        expect(query.filters).to.be.an.object()
        expect(query.filters.name).to.be.an.object()
        expect(query.filters.name).to.include(['value', 'operator', 'field'])
        expect(query.name).to.be.undefined()
    })

    it('should handle escaped characters', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/filter?name=like:%DHIS2%',
        })

        expect(res.statusCode).to.be.equal(200)
        const query = res.request.query
        expect(query.filters).to.be.an.object()
        expect(query.filters.name).to.be.an.object()
        expect(query.filters.name.value).to.be.equal('%DHIS2%')
    })

    it('should handle basic filter and fall back to "="', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/filter?name=DHIS2',
        })

        expect(res.statusCode).to.be.equal(200)
        const query = res.request.query
        expect(query.filters).to.be.an.object()
        expect(query.filters.name).to.be.an.object()
        expect(query.filters.name.value).to.be.equal('DHIS2')
        expect(query.filters.name.operator).to.be.equal('=')
    })

    it('should ignore when disabled on route-level', async () => {
        server.route({
            method: 'GET',
            path: '/noFilter',
            config: {
                plugins: {
                    queryFilter: {
                        enabled: false,
                    },
                },
            },
            handler: () => {
                return {}
            },
        })

        const res = await server.inject({
            method: 'GET',
            url: '/noFilter?name=DHIS2',
        })

        expect(res.request.filters).to.be.undefined()
        expect(res.request.query).to.be.an.object()
        expect(res.request.query.name).to.be.equal('DHIS2')
    })

    it('should ignore when disabled on server-level', async () => {
        const serv = Hapi.server({ port: 3002 })
        await serv.register({
            plugin: QueryFilterPlugin,
            options: {
                enabled: false,
            },
        })
        serv.route({
            method: 'GET',
            path: '/noFilterServer',
            handler: () => {
                return {}
            },
        })

        const res = await serv.inject({
            method: 'GET',
            url: '/noFilterServer?name=DHIS2',
        })

        expect(res.request.filters).to.be.undefined()
        expect(res.request.query).to.be.an.object()
        expect(res.request.query.name).to.be.equal('DHIS2')
        serv.stop()
    })

    it('should be enabled when "disabled at server-level and enabled at route-level"', async () => {
        const serv = Hapi.server({ port: 3002 })
        await serv.register({
            plugin: QueryFilterPlugin,
            options: {
                enabled: false,
            },
        })
        serv.route({
            method: 'GET',
            path: '/noFilterServer',
            config: {
                plugins: {
                    queryFilter: {
                        enabled: true,
                    },
                },
            },
            handler: () => {
                return {}
            },
        })

        const res = await serv.inject({
            method: 'GET',
            url: '/noFilterServer?name=DHIS2',
        })

        expect(res.statusCode).to.be.equal(200)
        const query = res.request.query
        expect(query).to.be.an.object()
        expect(query.filters).to.be.an.object()
        expect(query.filters.name).to.be.an.object()
        expect(query.filters.name).to.include(['value', 'operator', 'field'])
        expect(query.name).to.be.undefined()
        serv.stop()
    })

    it('should ignore fields in ignoreKeys', async () => {
        const serv = Hapi.server({ port: 3002 })
        await serv.register({
            plugin: QueryFilterPlugin,
            options: {
                enabled: false,
                ignoreKeys: ['paging', 'pageSize'],
            },
        })
        serv.route({
            method: 'GET',
            path: '/filter',
            config: {
                plugins: {
                    queryFilter: {
                        enabled: true,
                        ignoreKeys: ['ignored'],
                    },
                },
            },
            handler: () => {
                return {}
            },
        })
        const res = await serv.inject({
            method: 'GET',
            url: '/filter?name=DHIS2&ignored=eq:test',
        })

        expect(res.statusCode).to.be.equal(200)
        const query = res.request.query
        expect(query.filters).to.be.an.object()
        expect(query.filters.name).to.be.an.object()
        expect(query.filters.name.value).to.be.equal('DHIS2')
        expect(query.filters.name.operator).to.be.equal('=')

        expect(query.filters).to.not.include('ignored')
        expect(query.ignored).to.be.equals('eq:test')
    })

    describe('with validation', () => {
        let server
        before(async () => {
            server = Hapi.server({ port: 3001 })
            await server.register({ plugin: QueryFilterPlugin })
            server.route({
                method: 'GET',
                path: '/validationFilter',
                config: {
                    plugins: {
                        queryFilter: {
                            validate: Joi.object({
                                name: Joi.string(),
                                owner: Joi.string().guid(),
                            }).rename('owner', 'created_by'),
                        },
                    },
                },
                handler: () => {
                    return {}
                },
            })
        })

        it('should transform the value', async () => {
            const res = await server.inject({
                method: 'GET',
                url:
                    '/validationFilter?name=DHIS2&owner=eq:cedb4418-2417-4e72-bfcc-35ccd0dc3e41',
            })

            console.log(res.result)
            expect(res.statusCode).to.be.equal(200)
            console.log(res.request.query)
            console.log(res.request.query.filters)
        })
    })
})
