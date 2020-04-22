const Lab = require('@hapi/lab')
const { it, describe, before } = (exports.lab = Lab.script())
const { expect } = require('@hapi/code')
const QueryFilterPlugin = require('../../src/plugins/queryFilter')
const Joi = require('../../src/utils/CustomJoi')
const Hapi = require('@hapi/hapi')
const { Filters } = require('../../src/utils/Filter')

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
            handler: request => {
                const filters = request.plugins.queryFilter
                return filters
            },
        })
    })

    it('should ignore when no filters', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/filter',
        })
        expect(res.statusCode).to.be.equal(200)
        const filters = res.request.plugins.queryFilter
        expect(filters).to.be.instanceOf(Filters)
        expect(filters.filters).to.be.an.object()
        expect(Object.keys(filters.filters)).to.have.length(0)
    })

    it('it should parse query-params into filters-object', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/filter?name=eq:DHIS2',
        })
        expect(res.statusCode).to.be.equal(200)
        const filters = res.request.plugins.queryFilter
        expect(filters).to.be.instanceOf(Filters)
        console.log(filters)
        expect(filters.filters.name).to.be.an.object()
        expect(filters.filters.name).to.include(['value', 'operator'])
    })

    it('should handle escaped characters', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/filter?name=like:%DHIS2%',
        })

        expect(res.statusCode).to.be.equal(200)
        const filters = res.request.plugins.queryFilter.filters
        expect(filters).to.be.an.object()
        expect(filters.name).to.be.an.object()
        expect(filters.name.value).to.be.equal('%DHIS2%')
    })

    it('should handle basic filter and fall back to "eq"', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/filter?name=DHIS2',
        })

        expect(res.statusCode).to.be.equal(200)
        const filters = res.request.plugins.queryFilter.filters
        expect(filters).to.be.an.object()
        expect(filters.name).to.be.an.object()
        expect(filters.name.value).to.be.equal('DHIS2')
        expect(filters.name.operator).to.be.equal('eq')
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
        expect(res.request.plugins.queryFilter).to.be.undefined()
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

        expect(res.request.plugins.queryFilter).to.be.undefined()
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
        const filters = res.request.plugins.queryFilter.filters
        expect(filters).to.be.an.object()
        expect(filters.name).to.be.an.object()
        expect(filters.name).to.include(['value', 'operator'])
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
        const filters = res.request.plugins.queryFilter
        expect(filters).to.be.instanceOf(Filters)
        expect(filters.filters.name).to.be.an.object()
        expect(filters.filters.name.value).to.be.equal('DHIS2')
        expect(filters.filters.name.operator).to.be.equal('eq')

        expect(filters.filters).to.not.include('ignored')
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
                    validate: {
                        query: Joi.object({
                            name: Joi.filter(),
                            owner: Joi.filter(Joi.string().guid()),
                            created_by_user_id: Joi.filter(Joi.string().guid()),
                        }).rename('owner', 'created_by_user_id'),
                    },
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
        })
        it('should validate successfully', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/validationFilter?name=eq:DHIS2',
            })

            expect(res.statusCode).to.be.equal(200)

            const filters = res.request.plugins.queryFilter
            expect(filters).to.be.instanceof(Filters)
            expect(filters.filters).to.be.an.object()
            expect(filters.filters.name).to.include(['value', 'operator'])
        })

        it('should return 400 if validation fails', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/validationFilter?owner=eq:DHIS2',
            })

            expect(res.statusCode).to.be.equal(400)
        })

        it('should support rename of the key', async () => {
            const res = await server.inject({
                method: 'GET',
                url:
                    '/validationFilter?name=DHIS2&owner=eq:cedb4418-2417-4e72-bfcc-35ccd0dc3e41',
            })

            expect(res.statusCode).to.be.equal(200)

            const filters = res.request.plugins.queryFilter
            expect(filters).to.be.instanceof(Filters)
            expect(filters.filters).to.be.an.object()
            expect(filters.filters).to.include(['name', 'created_by_user_id'])
        })
    })
})
