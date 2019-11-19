const Lab = require('@hapi/lab')

// prepare environment
const { it, describe, before, after } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../../knexfile')
const db = require('knex')(knexConfig)

const { init } = require('../../../src/server/init-server')

describe('api/v2/channels', () => {
    const { config } = require('../../../src/server/env-config')

    let server
    before(async () => {
        server = await init(db, config)
    })

    after(async () => {
        await server.stop()
    })

    it('should return unauthorized trying to create a channel with no auth', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/v2/channels',
            payload: {
                name: 'Test',
            },
        })

        expect(response.statusCode).to.equal(401)
    })

    it('should return some channels with status code 200', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/api/v2/channels',
        })

        expect(response.statusCode).to.equal(200)

        const json = JSON.parse(response.payload)
        expect(json).to.be.an.array()
        expect(json.length)
            .to.be.a.number()
            .and.greaterThan(0)
    })

    it('should return unauthorized trying to update a channel with no auth', async () => {
        const response = await server.inject({
            method: 'PUT',
            url: '/api/v2/channels/some-uuid-should-normally-go-here',
            payload: {
                name: 'Test',
            },
        })

        expect(response.statusCode).to.equal(401)
    })
})

describe('api/v2/channels without configured auth', () => {
    const { config } = require('../../../src/server/noauth-config')

    let server
    before(async () => {
        config.auth.noAuthUserIdMapping = 1

        server = await init(db, config)
    })

    after(async () => {
        await server.stop()
    })

    it('should create a channel', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/v2/channels',
            payload: {
                name: 'Test',
            },
        })

        expect(response.statusCode).to.equal(200)

        const channel = JSON.parse(response.payload)
        expect(channel.uuid).to.exist()
        expect(channel.uuid).to.not.be.empty()
        expect(channel.name).to.exist()
        expect(channel.name).to.equal('Test')
    })

    it('should return some channels with status code 200', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/api/v2/channels',
        })

        expect(response.statusCode).to.equal(200)

        const json = JSON.parse(response.payload)
        expect(json).to.be.an.array()
        expect(json.length)
            .to.be.a.number()
            .and.greaterThan(0)
    })

    it('should create a channel followed by updating the name of it', async () => {
        const createResponse = await server.inject({
            method: 'POST',
            url: '/api/v2/channels',
            payload: {
                name: 'ChangeMe',
            },
        })

        expect(createResponse.statusCode).to.equal(200)
        const channel = JSON.parse(createResponse.payload)

        const response = await server.inject({
            method: 'PUT',
            url: '/api/v2/channels/' + channel.uuid,
            payload: {
                name: 'NewName',
            },
        })

        expect(response.statusCode).to.equal(200)
        const changedChannel = JSON.parse(response.payload)

        expect(changedChannel.uuid).to.equal(channel.uuid)
        expect(changedChannel.name).to.equal('NewName')
    })
})
