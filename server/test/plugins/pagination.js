const Lab = require('@hapi/lab')
const { it, describe, before } = (exports.lab = Lab.script())
const { expect } = require('@hapi/code')
const PaginationPlugin = require('../../src/plugins/pagination')
const Joi = require('../../src/utils/CustomJoi')
const Hapi = require('@hapi/hapi')
const { Pager } = require('../../src/query/Pager')

describe('@plugins::PaginationPlugin', () => {
    let server
    before(async () => {
        server = Hapi.server({ port: 3001 })
        await server.register({ plugin: PaginationPlugin })
        server.route({
            method: 'GET',
            path: '/paginate',
            options: {
                plugins: {
                    pagination: {
                        enabled: true,
                    },
                },
                response: {
                    failAction: (request, h, err) => {
                        console.log(err)
                        //throw err
                    },
                },
            },

            handler: request => {
                const pager = request.plugins.pagination
                //console.log(pager)
                return pager
            },
        })
    })

    it('should populate pager by default when enabled', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/paginate',
        })
        expect(res.statusCode).to.be.equal(200)
        const pager = res.request.plugins.pagination
        expect(pager).to.be.instanceOf(Pager)
        expect(pager.enabled).to.be.equal(true)
        expect(pager).to.include(['page', 'pageSize'])
    })

    it('it should parse query-params into Pager-instance', async () => {
        const page = 2
        const pageSize = 10
        const res = await server.inject({
            method: 'GET',
            url: `/paginate?page=${page}&pageSize=${pageSize}`,
        })
        expect(res.statusCode).to.be.equal(200)
        const pager = res.request.plugins.pagination
        expect(pager).to.be.instanceOf(Pager)
        expect(pager.enabled).to.be.equal(true)
        expect(pager.page).to.be.equal(page)
        expect(pager.pageSize).to.be.equal(pageSize)
    })

    it('should ignore when disabled on route-level', async () => {
        server.route({
            method: 'GET',
            path: '/paginateDisabled',
            config: {
                plugins: {
                    pagination: {
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
            url: '/paginateDisabled?paging=true',
        })
        expect(res.request.plugins.pagination).to.be.undefined()
    })

    it('should return 400 BadRequest if params are not valid', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/paginate?paging=asfasf',
        })

        expect(res.statusCode).to.be.equal(400)

        const res2 = await server.inject({
            method: 'GET',
            url: '/paginate?page=-1',
        })

        expect(res2.statusCode).to.be.equal(400)

        const res3 = await server.inject({
            method: 'GET',
            url: '/paginate?page=string',
        })

        expect(res3.statusCode).to.be.equal(400)
    })

    it('should remove paging-params from request.query by default', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/paginate?paging=true&otherParam',
        })

        expect(res.request.query).to.not.include('paging')
        expect(res.request.query).to.include('otherParam')
    })

    it('should not remove paging-params from request.query if keepParams is enabled', async () => {
        server.route({
            method: 'GET',
            path: '/paginateKeepParams',
            config: {
                plugins: {
                    pagination: {
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
            url: '/paginateKeepParams?paging=true&otherParam',
        })

        expect(res.request.query).to.include(['paging', 'otherParam'])
    })

    describe('decorate toolkit', () => {
        let server
        const rawResult = [...Array(30).keys()]
        before(async () => {
            server = Hapi.server({ port: 3001 })
            await server.register({ plugin: PaginationPlugin })

            server.route({
                method: 'GET',
                path: '/decorated',
                config: {
                    plugins: {
                        pagination: {
                            enabled: true,
                        },
                    },
                },
                handler: (request, h) => {
                    const pager = request.plugins.pagination
                    return h.paginate(pager, {
                        result: rawResult,
                        total: rawResult.length,
                    })
                },
            })

            server.route({
                method: 'GET',
                path: '/decoratedNoSlice',
                config: {
                    plugins: {
                        pagination: {
                            enabled: true,
                        },
                    },
                },
                handler: (request, h) => {
                    const pager = request.plugins.pagination
                    return h.paginate(
                        pager,
                        { result: rawResult, total: rawResult.length },
                        { slice: false }
                    )
                },
            })
        })

        it('should decorate toolkit with paginate function', async () => {
            expect(server.decorations.toolkit).to.include('paginate')
        })

        it('should slice array by default if longer than pageSize', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/decorated',
            })

            expect(res.result).to.be.an.object()
            expect(res.result.result).to.be.an.array()
            expect(res.result.pager).to.be.an.object()
            expect(res.result.result).to.have.length(res.result.pager.pageSize)

            expect(res.result.result[24]).to.equal(24)
        })

        it('should slice array according to paging-params', async () => {
            const page1Res = await server.inject({
                method: 'GET',
                url: '/decorated?page=1&pageSize=5',
            })

            expect(page1Res.result).to.be.an.object()
            expect(page1Res.result.result).to.be.an.array()
            expect(page1Res.result.pager).to.be.an.object()
            expect(page1Res.result.pager.pageSize).to.be.equal(5)
            expect(page1Res.result.pager.page).to.be.equal(1)
            expect(page1Res.result.result).to.have.length(5)
            expect(page1Res.result.result).to.include([0, 1, 2, 3, 4])
            expect(page1Res.result.result).to.not.include([5, 6])

            const page2Res = await server.inject({
                method: 'GET',
                url: '/decorated?page=2&pageSize=5',
            })
            expect(page2Res.result).to.be.an.object()
            expect(page2Res.result.result).to.be.an.array()
            expect(page2Res.result.pager).to.be.an.object()
            expect(page2Res.result.pager.pageSize).to.be.equal(5)
            expect(page2Res.result.pager.page).to.be.equal(2)
            expect(page2Res.result.result).to.have.length(5)

            expect(page2Res.result.result).to.include([5, 6, 7, 8, 9])
            expect(page2Res.result.result).to.not.include([0, 4])
        })

        it('should slice array according to paging-params', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/decorated',
            })

            expect(res.result).to.be.an.object()
            expect(res.result.result).to.be.an.array()
            expect(res.result.pager).to.be.an.object()
            expect(res.result.result).to.have.length(res.result.pager.pageSize)
        })

        it('should return the paginated response with same result if slice=false', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/decoratedNoSlice',
            })

            expect(res.result).to.be.an.object()
            expect(res.result.result).to.be.an.array()
            expect(res.result.pager).to.be.an.object()
            expect(res.result.result).to.have.length(30)
            expect(res.result.result).to.shallow.equal(rawResult)

            expect(res.result.pager.pageSize).to.be.equal(25)
            expect(res.result.pager.pageCount).to.be.equal(30)
        })
    })

    describe('PaginationPlugin with options', () => {
        let server
        before(async () => {
            server = Hapi.server({ port: 3001 })
            await server.register({
                plugin: PaginationPlugin,
                options: {
                    querySchema: Joi.object({
                        paging: Joi.boolean().default(true),
                        page: Joi.number()
                            .default(1)
                            .min(1),
                        pageSize: Joi.number()
                            .default(15)
                            .min(1),
                    }).rename('limit', 'pageSize'),
                    resultSchema: Joi.object({
                        pager: Joi.object({
                            page: Joi.number(),
                            pageCount: Joi.number(),
                            pageSize: Joi.number(),
                            total: Joi.number(),
                        }),
                        data: Joi.array(),
                    }).rename('result', 'data'),
                    decorate: false,
                },
            })

            server.route({
                method: 'GET',
                path: '/paginate',
                options: {
                    plugins: {
                        pagination: {
                            enabled: true,
                        },
                    },

                    handler: request => {
                        const pager = request.plugins.pagination
                        const res = [...Array(30).keys()]
                        const formatted = pager.formatResult(res, res.length)
                        return formatted
                    },
                },
            })

            server.route({
                method: 'GET',
                path: '/paginateOverride',
                options: {
                    plugins: {
                        pagination: {
                            enabled: true,
                            querySchema: Joi.object({
                                paging: Joi.boolean().default(true),
                                page: Joi.number()
                                    .default(1)
                                    .min(1),
                                pageSize: Joi.number()
                                    .default(15)
                                    .min(1),
                            }).rename('size', 'pageSize'),
                        },
                    },
                },

                handler: request => {
                    const pager = request.plugins.pagination
                    const res = [...Array(30).keys()]
                    const formatted = pager.formatResult(res, res.length)
                    return formatted
                },
            })
        })

        it('should use defaults from options', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/paginate',
            })
            expect(res.request.plugins.pagination).to.be.instanceOf(Pager)
            expect(res.request.plugins.pagination.pageSize).to.be.equal(15)

            expect(res.result.data).to.be.an.array()
        })

        it('should support renames on querySchema from options', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/paginate?limit=10',
            })

            expect(res.request.plugins.pagination).to.be.instanceOf(Pager)
            expect(res.request.plugins.pagination.pageSize).to.be.equal(10)
        })

        it('should override plugin-options with route-options', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/paginateOverride?size=5&limit=2',
            })

            expect(res.request.plugins.pagination).to.be.instanceOf(Pager)
            expect(res.request.plugins.pagination.pageSize).to.be.equal(5)
        })

        it('should not decorate toolkit when decorate=false', async () => {
            expect(server.decorations).to.not.include(['pagination'])
        })
    })
})
