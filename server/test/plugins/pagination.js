const Lab = require('@hapi/lab')
const { it, describe, before } = (exports.lab = Lab.script())
const { expect } = require('@hapi/code')
const PaginationPlugin = require('../../src/plugins/pagination')
const Joi = require('../../src/utils/CustomJoi')
const Hapi = require('@hapi/hapi')

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
                        throw err
                    },
                },
            },

            handler: request => {
                const pager = request.plugins.pagination
                return pager
            },
        })
    })

    it('it should parse query-params', async () => {
        const page = 2
        const pageSize = 10
        const res = await server.inject({
            method: 'GET',
            url: `/paginate?page=${page}&pageSize=${pageSize}`,
        })
        expect(res.statusCode).to.be.equal(200)
        const pager = res.request.plugins.pagination
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
            url: '/paginateDisabled',
        })
        expect(res.request.plugins.pagination).to.be.undefined()
    })

    it('should return 400 BadRequest if params are not valid', async () => {
        const res1 = await server.inject({
            method: 'GET',
            url: '/paginate?page=-1',
        })

        expect(res1.statusCode).to.be.equal(400)

        const res2 = await server.inject({
            method: 'GET',
            url: '/paginate?page=string',
        })

        expect(res2.statusCode).to.be.equal(400)
    })

    it('should remove paging-params from request.query', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/paginate?page=1&otherParam',
        })

        expect(res.request.query).to.not.include('page')
        expect(res.request.query).to.include('otherParam')
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
                    return h.paginate({
                        result: rawResult,
                        total: rawResult.length,
                    })
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
    })
})
