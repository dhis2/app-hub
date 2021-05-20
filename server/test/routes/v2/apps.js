const fs = require('fs')
const path = require('path')
const Lab = require('@hapi/lab')
const FormData = require('form-data')
const streamToPromise = require('stream-to-promise')

const {
    it,
    describe,
    afterEach,
    beforeEach,
    before,
} = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')
const knexConfig = require('../../../knexfile')
const dbInstance = require('knex')(knexConfig)
const organisations = require('../../../seeds/mock/organisations')
const appsMocks = require('../../../seeds/mock/apps')
const users = require('../../../seeds/mock/users')
const { init } = require('../../../src/server/init-server')
const { config } = require('../../../src/server/noauth-config')

describe('v2/apps', () => {
    let server
    let db

    before(() => {
        config.auth.noAuthUserIdMapping = users[0].id
    })

    beforeEach(async () => {
        db = await dbInstance.transaction()

        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()

        await db.rollback()
    })

    const sampleApp = {
        appType: 'APP',
        developer: {
            organisationId: organisations[0].id,
        },
    }

    const createFormForApp = app => {
        const form = new FormData()
        form.append('app', JSON.stringify(app))
        return form
    }

    describe('create app', () => {
        it('should create an app', async () => {
            const form = createFormForApp(sampleApp)
            const request = {
                method: 'POST',
                url: '/api/v2/apps',
                headers: form.getHeaders(),
                payload: await streamToPromise(form),
            }

            const res = await server.inject(request)
            expect(res.statusCode).to.equal(201)
            const receivedPayload = JSON.parse(res.payload)
            expect(receivedPayload).to.include(['id'])
            expect(receivedPayload.id).to.be.string()
        })
    })

    describe('get apps', () => {
        it('should get all approved apps', async () => {
            const request = {
                method: 'GET',
                url: '/api/v2/apps',
            }
            const rejectedApp = appsMocks[2]

            const res = await server.inject(request)
            expect(res.statusCode).to.equal(200)

            const apps = res.result.result
            expect(apps).to.be.an.array()
            expect(apps.length).to.be.min(4) // 4 seeds
            expect(apps.find(a => a.id === rejectedApp)).to.be.undefined()
        })

        it('should get apps-only when core=true ', async () => {
            const request = {
                method: 'GET',
                url: '/api/v2/apps?core=true',
            }

            const res = await server.inject(request)
            expect(res.statusCode).to.equal(200)

            const apps = res.result.result
            expect(apps).to.be.an.array()

            const notCore = apps.filter(
                a => a.developer.organisation !== 'DHIS2'
            )

            expect(notCore).to.have.length(0)
        })
    })
})
