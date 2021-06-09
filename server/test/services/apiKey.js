const { expect } = require('@hapi/code')

const Lab = require('@hapi/lab')

const { it, describe, beforeEach, afterEach } = (exports.lab = Lab.script())

const knexConfig = require('../../knexfile')
const dbInstance = require('knex')(knexConfig)

const UserMocks = require('../../seeds/mock/users')

const ApiKey = require('../../src/services/apiKey')

describe('@services: ApiKey', () => {
    let db
    const user = UserMocks[0]
    beforeEach(async () => {
        db = await dbInstance.transaction()
    })

    afterEach(async () => {
        await db.rollback()
    })

    describe('generateApiKey', () => {
        it('should generate a key and a hashedkey', () => {
            const res = ApiKey.generateApiKey()

            expect(res).to.be.an.object()
            expect(res.apiKey).to.be.a.string()
            expect(res.hashedKey).to.be.a.string()
            expect(res.hashedKey).to.have.length(64)
            expect(res.apiKey).to.have.length(36)
        })

        it('should be unique', () => {
            const res1 = ApiKey.generateApiKey()
            const res2 = ApiKey.generateApiKey()

            expect(res1).to.not.be.equal(res2)
            expect(res1.apiKey).to.not.be.equal(res2.apiKey)
        })
    })

    describe('hashKey', () => {
        it('should hash the key to the same hash', () => {
            const { apiKey, hashedKey } = ApiKey.generateApiKey()

            const hash = ApiKey.hashKey(apiKey)

            expect(hashedKey).to.be.equal(hash)
        })
    })

    describe('createApiKeyForUser', () => {
        it('should successfully generate apiKey for user', async () => {
            const apiKey = await ApiKey.createApiKeyForUser(user.id, db)

            expect(apiKey).to.be.a.string()
            expect(apiKey).to.have.length(36)
        })

        it('should throw error if user already has API-key', async () => {
            await ApiKey.createApiKeyForUser(user.id, db)

            expect(ApiKey.createApiKeyForUser(user.id, db)).to.reject()
        })
    })

    describe('getUserIdByApiKey', () => {
        it('should get the userId successfully', async () => {
            const apiKey = await ApiKey.createApiKeyForUser(user.id, db)

            const userId = await ApiKey.getUserIdByApiKey(apiKey, db)

            expect(userId).to.be.equal(user.id)
        })
    })

    describe('deleteApiKeyForUser', () => {
        it('should successfully delete an api key', async () => {
            await ApiKey.createApiKeyForUser(user.id, db)

            const deletedRows = await ApiKey.deleteApiKeyForUser(user.id, db)
            expect(deletedRows).to.be.equal(1)
        })

        it('should throw if user does not have API-key', async () => {
            expect(ApiKey.deleteApiKeyForUser(user.id, db)).to.reject()
        })
    })
})
