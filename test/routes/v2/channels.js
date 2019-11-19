const Lab = require('@hapi/lab')

// prepare environment
const { it, describe, beforeEach, afterEach } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../../knexfile')
const db = require('knex')(knexConfig)

const { init } = require('../../../src/server/init-server')

describe('api/v2/channels', () => {
    let server
    beforeEach(async () => {
        server = await init(db)
    })

    afterEach(async () => {
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
})
