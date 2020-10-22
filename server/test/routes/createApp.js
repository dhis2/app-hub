const Lab = require('@hapi/lab')
const fs = require('fs')
const path = require('path')
const request = require('request-promise')

const { it, describe, beforeEach, afterEach } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

const { init } = require('../../src/server/init-server')

const users = require('../../seeds/mock/users')

describe('test create app', () => {
    const { config } = require('../../src/server/noauth-config')
    let server
    beforeEach(async () => {
        config.auth.noAuthUserIdMapping = users[0].id
        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()
    })

    const sampleApp = {
        name: 'DHIS2 Sample App',
        description: 'A very nice sample description',
        appType: 'APP',
        sourceUrl: 'http://github.com',
        developer: {
            name: 'Foo Bar',
            email: 'foobar@dhis2.org',
            address: '',
            organisation: 'The Largest Testing Organization In The World.',
        },
        versions: [
            {
                version: '1.0.0',
                minDhisVersion: '2.25',
                maxDhisVersion: '2.33',
                demoUrl: 'https://www.dhis2.org',
                channel: 'Stable',
            },
        ],
        images: [],
    }

    it('should create a test app without any images', async () => {
        const form = {
            app: JSON.stringify(sampleApp),
            file: {
                value: fs.createReadStream(
                    path.join(__dirname, '../', 'sample-app.zip')
                ),
                options: {
                    filename: 'sample-app.zip',
                    contentType: 'application/zip',
                },
            },
        }

        const response = await request.post({
            url: `http://${server.settings.host}:${server.settings.port}/api/apps`,
            json: true,
            formData: form,
        })

        console.log('got response:', response)

        expect(response.statusCode).to.equal(200)
    })

    it('should return 400 bad request if version is not valid', async () => {
        const badVersionApp = {
            ...sampleApp,
            versions: [
                {
                    version: '2',
                    minDhisVersion: '2.25',
                    maxDhisVersion: '2.33',
                    demoUrl: 'https://www.dhis2.org',
                    channel: 'Stable',
                },
            ],
        }
        const form = {
            app: JSON.stringify(badVersionApp),
            file: {
                value: fs.createReadStream(
                    path.join(__dirname, '../', 'sample-app.zip')
                ),
                options: {
                    filename: 'sample-app.zip',
                    contentType: 'application/zip',
                },
            },
        }

        const response = await expect(request.post({
            url: `http://${server.settings.host}:${server.settings.port}/api/apps`,
            json: true,
            formData: form,
        })).to.reject()

        expect(response.statusCode).to.equal(400)
    })
})
