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
        name: 'DHIS2 Sample App',
        description: 'A very nice sample description',
        appType: 'APP',
        sourceUrl: 'http://github.com',
        developer: {
            name: 'Foo Bar',
            email: 'foobar@dhis2.org',
            organisationId: organisations[0].id,
        },
        version: {
            version: '1.0.0',
            minDhisVersion: '2.25',
            maxDhisVersion: '2.33',
            demoUrl: 'https://www.dhis2.org',
            channel: 'stable',
        },
    }

    const createFormForApp = app => {
        const form = new FormData()
        form.append('app', JSON.stringify(app))
        form.append(
            'file',
            fs.createReadStream(
                path.join(__dirname, '../../', 'sample-app.zip')
            )
        )
        form.append(
            'logo',
            fs.createReadStream(
                path.join(__dirname, '../../', 'sample-app-logo.png')
            )
        )
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

        it('should return 400 bad request if version is not valid', async () => {
            const badVersionApp = {
                ...sampleApp,
                version: {
                    ...sampleApp.version,
                    version: 'not a version',
                },
            }
            const form = createFormForApp(badVersionApp)
            const request = {
                method: 'POST',
                url: '/api/v2/apps',
                headers: form.getHeaders(),
                payload: await streamToPromise(form),
            }

            const res = await server.inject(request)
            expect(res.statusCode).to.equal(400)
        })
    })
})
