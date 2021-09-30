const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const FormData = require('form-data')
const Knex = require('knex')
const streamToPromise = require('stream-to-promise')
const { it, describe, afterEach, beforeEach, before } = (exports.lab =
    Lab.script())
const knexConfig = require('../../../knexfile')
const appsMocks = require('../../../seeds/mock/apps')
const organisations = require('../../../seeds/mock/organisations')
const users = require('../../../seeds/mock/users')
const { init } = require('../../../src/server/init-server')
const { config } = require('../../../src/server/noauth-config')

const dbInstance = Knex(knexConfig)

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
    const dhis2App = appsMocks[0]

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

    describe('get channels for app', () => {
        it('should only return channels that have versions published', async () => {
            const canaryOnlyApp = appsMocks[5]
            const request = {
                method: 'GET',
                url: `/api/v2/apps/${canaryOnlyApp.id}/channels`,
            }

            const res = await server.inject(request)

            expect(res.statusCode).to.equal(200)
            const result = res.result
            expect(result).to.be.an.array().length(1)
            expect(result[0]).to.be.equal('canary')
        })

        it('should return unique channels', async () => {
            const request = {
                method: 'GET',
                url: `/api/v2/apps/${dhis2App.id}/channels`,
            }

            const res = await server.inject(request)

            expect(res.statusCode).to.equal(200)
            const result = res.result

            expect(result).to.be.an.array().length(3)
            expect(result).to.include('stable')

            const unique = [...new Set(result)]
            expect(unique.length).to.equal(result.length)
        })
    })
})
