const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const { it, describe, afterEach, beforeEach, before, after } = (exports.lab = Lab.script())

const knexConfig = require('../../../knexfile')
const db = require('knex')(knexConfig)
const { init } = require('../../../src/server/init-server')
const { config } = require('../../../src/server/env-config')
const { Organisation } = require('../../../src/services')

describe('v2/organisations', () => {
    let server

    beforeEach(async () => {
        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()
    })

    describe('get organisation', () => {
        it('should get all organisations', async () => {
            const opts = {
                method: 'GET',
                url: '/api/v2/organisations',
            }

            const res = await server.inject(opts)

            expect(res.statusCode).to.equal(200)

            const orgs = JSON.parse(res.payload)
            expect(orgs).to.be.an.array()
            expect(orgs[0]).to.include([
                'uuid',
                'name',
                'slug',
                'createdByUserUuid',
            ])
            expect(orgs[0]).to.not.include(['id', 'createdByUserId'])
        })
    })

    describe('create organisation', async () => {
        it('should create successfully', async () => {
            const opts = {
                method: 'POST',
                url: '/api/v2/organisations',
                payload: {
                    name: 'HISP Tanzania',
                },
            }

            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(201)
            const payload = JSON.parse(res.payload)
            expect(payload).to.include(['uuid'])
            expect(payload.id).to.be.undefined()
        })

        it('should fail if no payload', async () => {
            const opts = {
                method: 'POST',
                url: '/api/v2/organisations',
                payload: {}
            }

            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(400)
        })
    })

    describe('add user to organisation', () => {
        it('should add user successfully', async () => {
            const [dhis2Org] = await Organisation.find(
                { filter: { name: 'HISP Tanzania' } },
                db
            )

            expect(dhis2Org).to.not.be.undefined()
            expect(dhis2Org.uuid).to.be.a.string()

            const opts = {
                method: 'POST',
                url: `/api/v2/organisations/${dhis2Org.uuid}/addUser`,
                payload: {
                    email: 'appstore-api@dhis2.org',
                },
            }
            const res = await server.inject(opts)

            expect(res.statusCode).to.equal(200)
        })

        it('should return 409 conflict if user does not exists', async () => {
            const [dhis2Org] = await Organisation.find(
                { filter: { name: 'DHIS2' } },
                db
            )

            expect(dhis2Org).to.not.be.undefined()
            expect(dhis2Org.uuid).to.be.a.string()

            const opts = {
                method: 'POST',
                url: `/api/v2/organisations/${dhis2Org.uuid}/addUser`,
                payload: {
                    email: 'example-fail@dhis2.org',
                },
            }
            const res = await server.inject(opts)

            expect(res.statusCode).to.equal(409)
        })
    })
})
