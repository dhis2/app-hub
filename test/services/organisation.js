const { expect } = require('@hapi/code')

const Lab = require('@hapi/lab')

const { it, describe, afterEach, beforeEach } = (exports.lab = Lab.script())

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)
const getUserByEmail = require('../../src/data/getUserByEmail')

const { ImageType } = require('../../src/enums')
const { Organisation } = require('../../src/services')

describe('@services::Organisation', () => {
    describe('find', () => {
        it('should find by name filter', async () => {
            const filter = {
                name: 'DHIS2',
            }
            const orgs = await Organisation.find({ filter }, db)
            const DHIS2App = orgs.find(o => o.name === 'DHIS2')
            expect(orgs.length).to.be.equal(1)
            expect(DHIS2App).to.not.be.null()
            expect(DHIS2App.id).to.equal(1)
        })

        it('should find all organisations without a specified filter', async () => {
            const orgs = ['DHIS2', 'World Health Organization']
            const dbOrgs = await Organisation.find({}, db)
            orgs.forEach(org => {
                const dbOrg = dbOrgs.find(o => o.name === org.name)
                expect(dbOrg).to.not.be.null()
            })
        })

        it('should find organisations by user if filter has userUuid', async () => {
            const user = await getUserByEmail('appstore-api@dhis2.org', db)
            const filter = {
                userUuid: user.uuid,
            }
            const orgs = await Organisation.find({ filter }, db)
            const DHIS2App = orgs.find(o => o.name === 'DHIS2')
            expect(DHIS2App).to.not.be.null()
        })

        it('should work with multiple filters, ie userUuid and name', async () => {
            const user = await getUserByEmail('appstore-api@dhis2.org', db)
            const filter = {
                name: 'DHIS2',
                userUuid: user.uuid,
            }
            const orgs = await Organisation.find({ filter }, db)
            const DHIS2App = orgs.find(o => o.name === 'DHIS2')
            expect(DHIS2App).to.not.be.null()
        })
    })

    describe('findByUuid', () => {
        it('should throw if no existing uuid', async () => {
            const org = Organisation.findByUuid(
                'caacbb8c-01b4-4f98-8839-4aafafd46fee',
                false,
                db
            )
            await expect(org).to.reject()
        })

        it('should find organisations by uuid with users', async () => {
            const orgs = await Organisation.find(
                { filter: { name: 'DHIS2' } },
                db
            )
            expect(orgs).to.have.length(1)
            const dhis2Org = orgs[0]
            expect(dhis2Org).to.not.be.null()
            expect(dhis2Org.name).to.be.equal('DHIS2')
            expect(dhis2Org.uuid).to.be.string()

            const orgByUuid = await Organisation.findByUuid(
                dhis2Org.uuid,
                true,
                db
            )
            expect(orgByUuid).to.not.be.null()
            expect(orgByUuid.users).to.be.an.array()
            const members = ['Mr Jenkins', 'Viktor Varland']
            members.forEach(name => {
                const member = orgByUuid.users.find(u => u.name === name)
                expect(member).to.not.be.undefined()
                expect(member.uuid).to.be.a.string()
            })
        })
    })

    describe('addUserById', async () => {
        it('should successfully add user to organisation', async () => {
            const userId = 2 //Erik, in WHO
            const orgs = await Organisation.find(
                { filter: { name: 'DHIS2' } },
                db
            )
            expect(orgs.length).to.be.equal(1)
            const org = orgs[0]

            expect(org.uuid).to.be.a.string()
            expect(org.name).to.be.equal('DHIS2')

            const res = await Organisation.addUserById(org.uuid, userId, db)

            const orgWithUsers = await Organisation.findByUuid(
                org.uuid,
                true,
                db
            )
            expect(orgWithUsers).to.include('name')
            expect(orgWithUsers.name).to.be.equal('DHIS2')
            expect(orgWithUsers.users).to.be.an.array()
            const user = orgWithUsers.users.find(
                u => u.name === 'Erik Arenhill'
            )
            expect(user).to.not.be.undefined()
            expect(user.email).to.be.equal('erik@dhis2.org')
        })

        it('should throw if user already exists in organisation', async () => {
            const userId = 2 //Erik, in WHO
            const orgs = await Organisation.find(
                { filter: { name: 'World Health Organization' } },
                db
            )
            expect(orgs.length).to.be.equal(1)
            const org = orgs[0]

            expect(org.uuid).to.be.a.string()
            expect(org.name).to.be.equal('World Health Organization')
            await expect(
                Organisation.addUserById(org.uuid, userId, db)
            ).to.reject(Error)
        })

        it('should work within a transaction', async () => {
            const userId = 3 //Viktor, in DHIS2
            const orgs = await Organisation.find(
                { filter: { name: 'World Health Organization' } },
                db
            )

            expect(orgs.length).to.be.equal(1)
            const org = orgs[0]

            expect(org.uuid).to.be.a.string()
            expect(org.name).to.be.equal('World Health Organization')

            const addUserAndGetOrg = async trx => {
                await Organisation.addUserById(org.uuid, userId, trx)
                const orgWithUsers = await Organisation.findByUuid(
                    org.uuid,
                    true,
                    trx
                )
                return orgWithUsers
            }

            const orgWithUsers = await db.transaction(addUserAndGetOrg)
            const newlyAddedUser = orgWithUsers.users.find(
                u => u.name === 'Viktor Varland'
            )
            expect(newlyAddedUser).to.not.be.undefined()
        })

        it('should rollback within a transaction', async () => {
            const userId = 2 //Erik, in WHO
            const appstoreUserId = 1 // Appstore, in DHIS2
            const orgs = await Organisation.find(
                { filter: { name: 'World Health Organization' } },
                db
            )
            const whoOrg = orgs[0]
            expect(orgs.length).to.be.equal(1)

            expect(whoOrg.uuid).to.be.a.string()
            expect(whoOrg.name).to.be.equal('World Health Organization')

            const addUser = async trx => {
                // appstoreUser to who
                await Organisation.addUserById(whoOrg.uuid, appstoreUserId, trx)
                const orgWithUsers = await Organisation.findByUuid(
                    whoOrg.uuid,
                    true,
                    trx
                )
                expect(orgWithUsers.users).to.be.an.array()
                const newUser = orgWithUsers.users.find(
                    u => u.name === 'Mr Jenkins'
                )
                expect(newUser).to.not.be.undefined()
                // add Erik to WHO, should fail
                await Organisation.addUserById(whoOrg.uuid, userId, trx)
                return true
            }

            try {
                const res = await db.transaction(addUser)
            } catch (e) {
                expect(e).to.be.an.error()
                const orgWithUsers = await Organisation.findByUuid(
                    whoOrg.uuid,
                    true,
                    db
                )
                expect(orgWithUsers.users).to.be.an.array()
                const newUser = orgWithUsers.users.find(
                    u => u.name === 'Mr Jenkins'
                )
                // should be rollbacked, so user should not have been added
                expect(newUser).to.be.undefined()
            }
        })
    })

    describe('create', () => {
        it('should create successfully', async () => {
            const userId = 1 // appstore
            const name = 'Unicef'
            const org = await Organisation.create({ userId, name }, db)
            expect(org.id).to.a.number()
            expect(org.uuid).to.be.a.string()
        })

        it('should fail to create when organisation is not unique', async () => {
            const userId = 1 // appstore
            const name = 'DHIS2'
            const org = await expect(
                Organisation.create({ userId, name }, db)
            ).to.reject()
        })

        it('should work within a transaction', async () => {
            const userId = 1 // appstore
            const jenkins = await getUserByEmail('appstore-api@dhis2.org', db)
            const name = 'Sintef'

            const createAndGetOrg = async trx => {
                const { id, uuid } = await Organisation.create(
                    { userId, name },
                    trx
                )
                expect(id).to.be.a.number()
                expect(uuid).to.be.a.string()
                return await Organisation.findByUuid(uuid, true, trx)
            }

            const org = await db.transaction(createAndGetOrg)
            expect(org.name).to.be.equal(name)
            expect(org.createdByUserUuid).to.be.equal(jenkins.uuid)
        })
    })

    describe('setCreatedByUserId', () => {
        it('should set userId successfully', async () => {
            const user = await getUserByEmail('viktor@dhis2.org', db)
            const orgs = await Organisation.find(
                { filter: { name: 'DHIS2' } },
                db
            )
            expect(orgs).to.have.length(1)
            const org = orgs[0]
            expect(org.createdByUserUuid).to.not.be.equal(user.uuid)
            expect(user.id).to.be.equal(3)
            await Organisation.setCreatedByUserId(org.uuid, user.id, db)

            const [updatedOrg] = await Organisation.find(
                { filter: { name: 'DHIS2' } },
                db
            )
            expect(updatedOrg).to.not.be.undefined()
            expect(updatedOrg.createdByUserUuid).to.be.equal(user.uuid)
        })
    })
})
