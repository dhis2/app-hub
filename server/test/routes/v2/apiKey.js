const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const {
    it,
    describe,
    afterEach,
    beforeEach,
    before,
} = (exports.lab = Lab.script())

const knexConfig = require('../../../knexfile')
const dbInstance = require('knex')(knexConfig)
const { init } = require('../../../src/server/init-server')
const { config } = require('../../../src/server/noauth-config')
const UserMocks = require('../../../seeds/mock/users')

describe('v2/key', () => {
    let server
    let db

    before(async () => {
        config.auth.noAuthUserIdMapping = UserMocks[0].id
    })

    beforeEach(async () => {
        db = await dbInstance.transaction()

        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()

        await db.rollback()
    })

    describe('create API-key', () => {
        it('should successfully generate an API-key', async () => {
            const opts = {
                method: 'POST',
                url: '/api/v2/key',
            }

            const res = await server.inject(opts)

            expect(res.statusCode).to.equal(200)

            const result = res.result

            expect(result).to.be.an.object()
            expect(result.apiKey).to.be.a.string()
            expect(result.apiKey).to.have.length(36)
        })

        it('should return 409 conflict if user already has API-key', async () => {
            const opts = {
                method: 'POST',
                url: '/api/v2/key',
            }

            const res1 = await server.inject(opts)

            expect(res1.statusCode).to.equal(200)

            const res2 = await server.inject(opts)
            expect(res2.statusCode).to.equal(409)

            expect(res2.result.message).to.equal('Only one API-key per user')
        })
    })

    describe('get API-key status', () => {
        it('should return object with false if user does not have an API-key', async () => {
            const opts = {
                method: 'GET',
                url: '/api/v2/key',
            }

            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(200)

            expect(res.result).to.be.an.object()
            expect(res.result.hasApiKey).to.equal(false)
        })
        it('should return object with true if user does not have an API-key', async () => {
            const createRes = await server.inject({
                method: 'POST',
                url: '/api/v2/key',
            })

            expect(createRes.statusCode).to.equal(200)

            const opts = {
                method: 'GET',
                url: '/api/v2/key',
            }

            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(200)

            expect(res.result).to.be.an.object()
            expect(res.result.hasApiKey).to.equal(true)
        })
    })
})
