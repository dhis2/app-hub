const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const {
    it,
    describe,
    afterEach,
    beforeEach,
    before,
} = (exports.lab = Lab.script())
const Hapi = require('@hapi/hapi')
const knexConfig = require('../../knexfile')
const dbInstance = require('knex')(knexConfig)
const { init } = require('../../src/server/init-server')
const { config } = require('../../src/server/noauth-config')
const UserMocks = require('../../seeds/mock/users')
const { createApiKeyValidationFunc } = require('../../src/security')
const { scheme: apiKeyScheme } = require('../../src/security/apiKeyScheme')

describe('v2/key', () => {
    let server
    let db
    let protectedServer
    before(async () => {
        config.auth.noAuthUserIdMapping = UserMocks[0].id
    })

    beforeEach(async () => {
        db = await dbInstance.transaction()

        server = await init(db, config)
        protectedServer = Hapi.server({ port: 3003 })
        protectedServer.auth.scheme('api-key', apiKeyScheme)
        protectedServer.auth.strategy('api-key', 'api-key', {
            validate: createApiKeyValidationFunc(db),
        })
        protectedServer.route({
            method: 'GET',
            config: {
                auth: {
                    strategies: ['api-key'],
                },
            },

            path: '/protectedKey',
            handler: () => {
                return 'Success!'
            },
        })
    })

    afterEach(async () => {
        await server.stop()
        await protectedServer.stop()
        await db.rollback()
    })

    describe('use apiKey', () => {
        it('should have a protected route that returns 401 - unauthorized', async () => {
            const res = await protectedServer.inject({
                method: 'GET',
                url: '/protectedKey',
            })

            expect(res.statusCode).to.be.equal(401)
        })

        it('should accept a valid API-key in header', async () => {
            const createKeyRes = await server.inject({
                method: 'POST',
                url: '/api/v2/key',
            })

            expect(createKeyRes.statusCode).to.be.equal(200)
            const apiKey = createKeyRes.result.apiKey
            expect(apiKey).to.be.a.string()
            expect(apiKey).to.have.length(36)
            const res = await protectedServer.inject({
                method: 'GET',
                url: '/protectedKey',
                headers: {
                    'x-api-key': apiKey,
                },
            })

            expect(res.statusCode).to.be.equal(200)
            expect(res.result).to.be.equal('Success!')
        })
    })
})
