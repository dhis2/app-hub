const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const { it, describe, afterEach, beforeEach, before } = (exports.lab =
    Lab.script())

const knexConfig = require('../../../knexfile')
const dbInstance = require('knex')(knexConfig)
const { init } = require('../../../src/server/init-server')
const { config } = require('../../../src/server/noauth-config')
const { Organisation } = require('../../../src/services')
const OrgMocks = require('../../../seeds/mock/organisations')
const UserMocks = require('../../../seeds/mock/users')
const { Filters } = require('../../../src/utils/Filter')

describe('v2/organisations', () => {
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
            expect(orgs[0]).to.include(['id', 'name', 'slug', 'owner'])
        })

        it('should get one organisation by id', async () => {
            const dhis2Org = OrgMocks[0]
            const request = {
                method: 'GET',
                url: `/api/v2/organisations/${dhis2Org.id}`,
            }

            const res = await server.inject(request)
            const payload = JSON.parse(res.payload)
            expect(payload).to.be.an.object()
            expect(payload).to.include(['id', 'name', 'slug', 'owner', 'users'])
        })

        it('should get one organisation by slug', async () => {
            const dhis2Org = OrgMocks[0]
            const request = {
                method: 'GET',
                url: `/api/v2/organisations/${dhis2Org.slug}`,
            }

            const res = await server.inject(request)
            const payload = JSON.parse(res.payload)
            expect(payload).to.be.an.object()
            expect(payload).to.include(['id', 'name', 'slug', 'owner', 'users'])
        })

        it('should return 404 not found if slug does not exist', async () => {
            const request = {
                method: 'GET',
                url: `/api/v2/organisations/some-slug`,
            }

            const res = await server.inject(request)
            expect(res.statusCode).to.be.equal(404)
            expect(res.result.message).to.be.equal('Not Found')
        })
    })

    describe('create organisation', () => {
        it('should create successfully', async () => {
            const orgName = 'HISP Tanzania'
            const opts = {
                method: 'POST',
                url: '/api/v2/organisations',
                payload: {
                    name: orgName,
                },
            }

            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(201)
            const payload = JSON.parse(res.payload)
            expect(payload).to.include(['id'])
            expect(payload.id).to.be.string()
        })

        it('should add the user to the newly added org', async () => {
            const userId = config.auth.noAuthUserIdMapping
            const orgName = 'HISP Uganda'
            const opts = {
                method: 'POST',
                url: '/api/v2/organisations',
                payload: {
                    name: orgName,
                },
            }

            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(201)
            const payload = JSON.parse(res.payload)
            expect(payload).to.include(['id'])
            expect(payload.id).to.be.string()

            const request = {
                method: 'GET',
                url: `/api/v2/organisations/${payload.id}`,
            }

            const orgRes = await server.inject(request)
            const orgPayload = JSON.parse(orgRes.payload)
            expect(orgPayload).to.be.an.object()
            expect(orgPayload.id).to.be.equal(payload.id)
            expect(orgPayload.name).to.be.equal(orgName)
            expect(orgPayload.users).to.be.an.array()
            expect(orgPayload.users).to.have.length(1)
            expect(orgPayload.users[0].id).to.be.equal(userId)
        })

        it('should fail if no payload', async () => {
            const opts = {
                method: 'POST',
                url: '/api/v2/organisations',
                payload: {},
            }

            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(400)
        })
    })

    describe('update organisation', () => {
        it('should update name successfully', async () => {
            const org = OrgMocks[0]
            const request = {
                method: 'PATCH',
                url: `/api/v2/organisations/${org.id}`,
                payload: {
                    name: 'D2',
                },
            }
            const res = await server.inject(request)
            expect(res.statusCode).to.equal(200)
            expect(res.result).to.be.an.object()
            expect(res.result).to.include(['id'])
            const updatedOrg = await Organisation.findOne(org.id, false, db)
            expect(updatedOrg.name).to.equal('D2')

            // reset name
            await Organisation.update(org.id, { name: 'DHIS2' }, db)
        })

        it('should throw 400: Bad Request when payload is missing', async () => {
            const org = OrgMocks[1]
            const request = {
                method: 'PATCH',
                url: `/api/v2/organisations/${org.id}`,
            }
            const res = await server.inject(request)

            expect(res.statusCode).to.equal(400)
        })
    })

    describe('add user to organisation', () => {
        it('should add user successfully', async () => {
            const [whoOrg] = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:World Health Organization`,
                    }),
                },
                db
            )

            expect(whoOrg).to.not.be.undefined()
            expect(whoOrg.id).to.be.a.string()

            const opts = {
                method: 'POST',
                url: `/api/v2/organisations/${whoOrg.id}/user`,
                payload: {
                    email: 'viktor@dhis2.org',
                },
            }
            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(200)
        })

        it('should return 409 conflict if user does not exists', async () => {
            const [dhis2Org] = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:DHIS2`,
                    }),
                },
                db
            )

            expect(dhis2Org).to.not.be.undefined()
            expect(dhis2Org.id).to.be.a.string()

            const opts = {
                method: 'POST',
                url: `/api/v2/organisations/${dhis2Org.id}/user`,
                payload: {
                    email: 'example-fail@dhis2.org',
                },
            }
            const res = await server.inject(opts)

            expect(res.statusCode).to.equal(409)
        })
    })

    describe('remove user from organisation', () => {
        it('should remove successfully', async () => {
            const [dhis2Org] = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:DHIS2`,
                    }),
                },
                db
            )

            const userToDelete = UserMocks[2] //viktor, DHIS2

            expect(dhis2Org).to.not.be.undefined()
            expect(dhis2Org.id).to.be.a.string()

            const opts = {
                method: 'DELETE',
                url: `/api/v2/organisations/${dhis2Org.id}/user`,
                payload: {
                    user: userToDelete.id,
                },
            }
            const res = await server.inject(opts)

            expect(res.statusCode).to.equal(200)
        })

        it('should return conflict when user is the creator', async () => {
            const [dhis2Org] = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:DHIS2`,
                    }),
                },
                db
            )

            const userToDelete = UserMocks[0] //appphub

            expect(dhis2Org).to.not.be.undefined()
            expect(dhis2Org.id).to.be.a.string()

            const opts = {
                method: 'DELETE',
                url: `/api/v2/organisations/${dhis2Org.id}/user`,
                payload: {
                    user: userToDelete.id,
                },
            }
            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(409)
            expect(res.result.message).to.be.equal(
                'Cannot remove the owner of the organisation'
            )
        })

        it('should return conflict when user does not exist', async () => {
            const userToDelete = '72bced64-c7f7-4b70-aa09-9b8d1e59ed49'
            const [dhis2Org] = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:DHIS2`,
                    }),
                },
                db
            )

            const opts = {
                method: 'DELETE',
                url: `/api/v2/organisations/${dhis2Org.id}/user`,
                payload: {
                    user: userToDelete,
                },
            }
            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(409)
            expect(res.result.message).to.be.equal(
                'User not found or not a member of organisation'
            )
        })

        it('should return 404: not found when organisation does not exist', async () => {
            const orgId = '72bced64-c7f7-4b70-aa09-9b8d1e59ed49'
            const userToDelete = UserMocks[0] //apphub

            const opts = {
                method: 'DELETE',
                url: `/api/v2/organisations/${orgId}/user`,
                payload: {
                    user: userToDelete.id,
                },
            }
            const res = await server.inject(opts)
            expect(res.statusCode).to.equal(404)
            expect(res.result.message).to.be.equal('Not Found')
        })
    })
})
