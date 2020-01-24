const { expect } = require('@hapi/code')

const Lab = require('@hapi/lab')

const { it, describe, afterEach, beforeEach } = (exports.lab = Lab.script())

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)
const getUserByEmail = require('../../src/data/getUserByEmail')

const { ImageType } = require('../../src/enums')
const { Organisation } = require('../../src/services')
const UserMocks = require('../../seeds/mock/users')
const OrganisationMocks = require('../../seeds/mock/organisations')
const { Filters } = require('../../src/utils/Filter')

describe('@services::Organisation', () => {
    describe('find', () => {
        it('should find by name filter', async () => {
            const filter = {
                name: 'eq:DHIS2',
            }
            const filters = Filters.createFromQueryFilters(filter)
            const orgs = await Organisation.find({ filters }, db)
            const DHIS2App = orgs.find(o => o.name === 'DHIS2')
            expect(orgs.length).to.be.equal(1)
            expect(DHIS2App).to.not.be.null()
        })

        it('should find all organisations without a specified filter', async () => {
            const orgs = ['DHIS2', 'World Health Organization']
            const dbOrgs = await Organisation.find({}, db)
            orgs.forEach(org => {
                const dbOrg = dbOrgs.find(o => o.name === org.name)
                expect(dbOrg).to.not.be.null()
            })
        })

        it('should find organisations by user if filter has user', async () => {
            const user = await getUserByEmail('apphub-api@dhis2.org', db)
            const filter = {
                user: user.id,
            }
            const orgs = await Organisation.find({ filter }, db)
            const DHIS2App = orgs.find(o => o.name === 'DHIS2')
            expect(DHIS2App).to.not.be.null()
        })

        it('should work with multiple filters, ie user and name', async () => {
            const user = await getUserByEmail('apphub-api@dhis2.org', db)
            const filter = {
                name: 'DHIS2',
                user: user.id,
            }
            const orgs = await Organisation.find({ filter }, db)
            const DHIS2App = orgs.find(o => o.name === 'DHIS2')
            expect(DHIS2App).to.not.be.null()
        })
    })

    describe('findOne', () => {
        it('should throw if no existing id', async () => {
            const org = Organisation.findOne(
                'caacbb8c-01b4-4f98-8839-4aafafd46fee',
                false,
                db
            )
            await expect(org).to.reject()
        })

        it('should find organisations by id with users', async () => {
            const orgs = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:DHIS2`,
                    }),
                },
                db
            )
            expect(orgs).to.have.length(1)
            const dhis2Org = orgs[0]
            expect(dhis2Org).to.not.be.null()
            expect(dhis2Org.name).to.be.equal('DHIS2')
            expect(dhis2Org.id).to.be.string()

            const orgById = await Organisation.findOne(dhis2Org.id, true, db)
            expect(orgById).to.not.be.null()
            expect(orgById.users).to.be.an.array()
            const members = ['Mr Jenkins']
            members.forEach(name => {
                const member = orgById.users.find(u => u.name === name)
                expect(member).to.not.be.undefined()
                expect(member.id).to.be.a.string()
            })
        })
    })

    describe('addUserById', async () => {
        it('should successfully add user to organisation', async () => {
            const userId = UserMocks[1].id //Erik, in WHO
            const orgs = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:DHIS2`,
                    }),
                },
                db
            )
            expect(orgs.length).to.be.equal(1)
            const org = orgs[0]

            expect(org.id).to.be.a.string()
            expect(org.name).to.be.equal('DHIS2')

            const res = await Organisation.addUserById(org.id, userId, db)

            const orgWithUsers = await Organisation.findOne(org.id, true, db)
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
            const userId = UserMocks[1].id //Erik, in WHO
            const orgs = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:World Health Organization`,
                    }),
                },
                db
            )
            expect(orgs.length).to.be.equal(1)
            const org = orgs[0]

            expect(org.id).to.be.a.string()
            expect(org.name).to.be.equal('World Health Organization')
            await expect(
                Organisation.addUserById(org.id, userId, db)
            ).to.reject(Error)
        })

        it('should work within a transaction', async () => {
            const userId = UserMocks[2].id //Viktor, in DHIS2
            const orgs = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:World Health Organization`,
                    }),
                },
                db
            )

            expect(orgs.length).to.be.equal(1)
            const org = orgs[0]

            expect(org.id).to.be.a.string()
            expect(org.name).to.be.equal('World Health Organization')

            const addUserAndGetOrg = async trx => {
                await Organisation.addUserById(org.id, userId, trx)
                const orgWithUsers = await Organisation.findOne(
                    org.id,
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
            const userId = UserMocks[1].id //Erik, in WHO
            const appstoreUserId = UserMocks[0].id // Appstore, in DHIS2
            const orgs = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:World Health Organization`,
                    }),
                },
                db
            )
            const whoOrg = orgs[0]
            expect(orgs.length).to.be.equal(1)

            expect(whoOrg.id).to.be.a.string()
            expect(whoOrg.name).to.be.equal('World Health Organization')

            const addUser = async trx => {
                // appstoreUser to who
                await Organisation.addUserById(whoOrg.id, appstoreUserId, trx)
                const orgWithUsers = await Organisation.findOne(
                    whoOrg.id,
                    true,
                    trx
                )
                expect(orgWithUsers.users).to.be.an.array()
                const newUser = orgWithUsers.users.find(
                    u => u.name === 'Mr Jenkins'
                )
                expect(newUser).to.not.be.undefined()
                // add Erik to WHO, should fail
                await Organisation.addUserById(whoOrg.id, userId, trx)
                return true
            }

            try {
                const res = await db.transaction(addUser)
            } catch (e) {
                expect(e).to.be.an.error()
                const orgWithUsers = await Organisation.findOne(
                    whoOrg.id,
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
            const userId = UserMocks[0].id // appstore
            const name = 'Unicef'
            const org = await Organisation.create({ userId, name }, db)
            expect(org.id).to.be.a.string()
        })

        it('should fail to create when organisation is not unique', async () => {
            const userId = UserMocks[0].id // appstore
            const name = 'DHIS2'
            const org = await expect(
                Organisation.create({ userId, name }, db)
            ).to.reject()
        })

        it('should work within a transaction', async () => {
            const userId = UserMocks[0].id // appstore
            const jenkins = await getUserByEmail('apphub-api@dhis2.org', db)
            const name = 'Sintef'

            const createAndGetOrg = async trx => {
                const { id } = await Organisation.create({ userId, name }, trx)
                expect(id).to.be.a.string()
                return await Organisation.findOne(id, true, trx)
            }

            const org = await db.transaction(createAndGetOrg)
            expect(org.name).to.be.equal(name)
            expect(org.owner).to.be.equal(jenkins.id)
        })
    })

    describe('update', () => {
        it('should update name successfully', async () => {
            const orgName = 'World Health Organization'
            const orgs = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: `eq:${orgName}`,
                    }),
                },
                db
            )
            expect(orgs).to.have.length(1)
            const org = orgs[0]
            expect(org.name).to.be.equal(orgName)

            await Organisation.update(
                org.id,
                {
                    name: 'WHO',
                },
                db
            )

            const updatedOrg = await Organisation.findOne(org.id, false, db)
            expect(updatedOrg.name).to.be.equal('WHO')
            expect(updatedOrg.id).to.be.equal(org.id)
        })

        it('should set owner successfully', async () => {
            const user = await getUserByEmail('viktor@dhis2.org', db)
            const orgs = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: 'eq:WHO',
                    }),
                },
                db
            )
            expect(orgs).to.have.length(1)
            const org = orgs[0]
            const oldOwner = org.owner
            expect(org.owner).to.not.be.equal(user.id)
            await Organisation.update(org.id, { owner: user.id }, db)

            const [updatedOrg] = await Organisation.find(
                {
                    filters: Filters.createFromQueryFilters({
                        name: 'eq:WHO',
                    }),
                },
                db
            )
            expect(updatedOrg).to.not.be.undefined()
            expect(updatedOrg.owner).to.be.equal(user.id)

            //reset to old owner
            await Organisation.update(org.id, { owner: oldOwner }, db)
        })

        it('should update name and owner successfully', async () => {
            const user = UserMocks[0]
            const org = OrganisationMocks[1]

            expect(org.owner).to.not.be.equal(user.id)
            await Organisation.update(
                org.id,
                { name: 'World Health Organization', owner: user.id },
                db
            )

            const updatedOrg = await Organisation.findOne(org.id, false, db)

            expect(updatedOrg).to.be.an.object()
            expect(updatedOrg.owner).to.be.equal(user.id)
            expect(updatedOrg.name).to.be.equal('World Health Organization')
            //reset to old owner
            await Organisation.update(
                org.id,
                { owner: org.created_by_user_id },
                db
            )
        })
    })
})
