const Lab = require('@hapi/lab')

// prepare environment
const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

const { MediaType } = require('../../src/enums')
const { addAppMedia, getAppsById, createApp } = require('../../src/data')

const users = require('../../seeds/mock/users')
const apps = require('../../seeds/mock/apps')
const appVersions = require('../../seeds/mock/appversions')

describe('@data::addAppMedia', () => {
    it('Should throw an error if config object does not pass validation', async () => {
        await expect(addAppMedia({}, null, null)).to.reject(
            Error,
            'ValidationError: "appId" is required'
        )
    })

    it('should add appmedia successfully', async () => {
        const appMedia = {
            appId: appVersions[0][0].app_id, //DHIS2 app
            userId: users[0].id, //travis user
            mediaType: MediaType.Screenshot,
            fileName: 'screenshot.jpg',
            mime: 'image/jpeg',
            caption: 'Test caption',
            description: 'a description',
        }
        const trx = await db.transaction()
        const { id } = await addAppMedia(appMedia, trx)
        await trx.commit()
        expect(id).to.be.string()
        expect(id.length).to.be.equal(36)
    })
})

describe('@data::getAppsById', () => {
    it('should require uuid parameter', async () => {
        await expect(getAppsById(null, 'sv', null)).to.reject(
            Error,
            `Missing parameter 'id'`
        )
    })

    it('should require languagecode parameter', async () => {
        await expect(
            getAppsById('2621d406-a908-476a-bcd2-e55abe3445b4', null, null)
        ).to.reject(Error, `Missing parameter 'languageCode'`)
    })

    it('should require knex parameter', async () => {
        await expect(
            getAppsById('2621d406-a908-476a-bcd2-e55abe3445b4', 'sv', null)
        ).to.reject(Error, `Missing parameter 'knex'`)
    })
})

describe('@data::createApp', () => {
    it('should require userId parameter and it to be a uuid', async () => {
        await expect(createApp({}, null, null)).to.reject(Error)

        await expect(createApp({ userId: '' }, null, null)).to.reject(Error)
    })

    it('should require orgId parameter and it to be a uuid', async () => {
        const config = {
            userId: users[0].id,
        }

        await expect(createApp(config, null, null)).to.reject(Error)

        await expect(createApp({ ...config, orgId: '' }, null, null)).to.reject(
            Error
        )
    })
})

describe('@data::getOrganisation', () => {
    const {
        getOrganisationById,
        getOrganisationsByName,
    } = require('../../src/data')

    it('should throw an error passing invalid id', async () => {
        await expect(getOrganisationById('asdf', db)).to.reject(Error)
    })

    it('get the organisation with the specified id', async () => {
        console.log('db:', db)
        const [dhis2Org] = await getOrganisationsByName('DHIS2', db)
        expect(dhis2Org).to.not.be.null()

        const dhis2OrgById = await getOrganisationById(dhis2Org.id, db)
        expect(dhis2OrgById).to.not.be.null()

        expect(dhis2Org.id).to.equal(dhis2OrgById.id)
    })

    it('get the organisation named DHIS2', async () => {
        const [dhis2Org] = await getOrganisationsByName('DHIS2', db)

        expect(dhis2Org).to.not.be.null()
        expect(dhis2Org.id).to.be.a.string()
        expect(dhis2Org.name).to.equal('DHIS2')
    })
})

describe('@data::createOrganisation', () => {
    const {
        deleteOrganisation,
        createOrganisation,
        getOrganisationsByName,
    } = require('../../src/data')

    it('should create an organisation and then delete it', async () => {
        let transaction = await db.transaction()

        const org = await createOrganisation(
            {
                userId: users[0].id,
                name: 'Test create organisation åäöèé',
            },
            db,
            transaction
        )

        await transaction.commit()

        expect(org.id).to.be.a.string()

        expect(org.id.length).to.be.equal(36)
        expect(org.slug).to.equal('test-create-organisation-aaoee')
        expect(org.name).to.equal('Test create organisation åäöèé')

        const [shouldExist] = await getOrganisationsByName(org.name, db)
        expect(shouldExist.id).to.be.equal(org.id)
        expect(shouldExist.name).to.be.equal(org.name)
        expect(shouldExist.slug).to.be.equal(org.slug)

        //Delete then try to fetch again.
        transaction = await db.transaction()
        const successfullyDeleted = await deleteOrganisation(
            { id: org.id },
            db,
            transaction
        )
        await transaction.commit()

        expect(successfullyDeleted).to.be.true()

        const organisationsWithName = await getOrganisationsByName(org.name, db)
        expect(organisationsWithName).to.be.empty()
    })
})

describe('@data::createUser', () => {
    const { createUser } = require('../../src/data')

    it('should create a new user', async () => {
        const transaction = await db.transaction()

        const { id } = await createUser(
            {
                email: 'test@test.com',
            },
            db,
            transaction
        )

        await transaction.commit()

        expect(id).to.be.a.string()
    })
})

describe('@data::addUserToOrganisation', () => {
    const {
        addUserToOrganisation,
        createOrganisation,
    } = require('../../src/data')

    it('should add a user to an organisation without throwing', async () => {
        const transaction = await db.transaction()

        const org = await createOrganisation(
            { userId: users[0].id, name: 'A new organisation' },
            transaction
        )

        await addUserToOrganisation(
            { userId: users[0].id, organisationId: org.id },
            transaction
        )

        await transaction.commit()
    })
})

describe('@data::updateApp', () => {
    const { updateApp, getAllAppsByLanguage } = require('../../src/data')

    it('should update the app', async () => {
        const transaction = await db.transaction()

        const allApps = await getAllAppsByLanguage('en', db)

        const firstApp = allApps[0]
        expect(firstApp).to.not.be.null()
        expect(firstApp.id).to.not.be.null()

        const { app_id } = firstApp

        const newData = {
            id: app_id,
            userId: firstApp.developer_id,
            name: 'Changed name',
            sourceUrl: 'https://some/url',
            demoUrl: 'http://some/other/url',
            description: 'Changed description',
            languageCode: 'en',
        }

        await updateApp(newData, transaction)

        await transaction.commit()

        const allAppVersionsWithUuid = await getAppsById(app_id, 'en', db)

        expect(allAppVersionsWithUuid.length).to.be.min(1)

        allAppVersionsWithUuid.forEach(app => {
            expect(app.name).to.be.equal(newData.name)
            expect(app.source_url).to.be.equal(newData.sourceUrl)
            expect(app.description).to.be.equal(newData.description)
        })
    })
})

describe('@data::updateAppVersion', () => {
    const { updateAppVersion } = require('../../src/data')

    it('should update the app version', async () => {
        let transaction = await db.transaction()

        //See seeds/mock/apps.js
        const mockAppId = '2621d406-a908-476a-bcd2-e55abe3445b4'
        const appVersionIdToUpdate = '792aa26c-5595-4ae5-a2f8-028439060e2e'

        //First check that we fetch the correct object to change
        const [app] = (await getAppsById(mockAppId, 'en', db)).filter(
            app => app.version_id === appVersionIdToUpdate
        )
        expect(app.version_id).to.equal(appVersionIdToUpdate)
        expect(app.version).to.equal('0.1')
        expect(app.max_dhis2_version).to.equal(null)
        expect(app.min_dhis2_version).to.equal('2.28')
        expect(app.demo_url).to.equal(null)

        await updateAppVersion(
            {
                id: appVersionIdToUpdate,
                userId: app.developer_id,
                minDhisVersion: '123',
                maxDhisVersion: '456',
                version: '789',
                demoUrl: 'https://www.google.com',
            },
            transaction
        )

        await transaction.commit()

        const [updatedApp] = (await getAppsById(mockAppId, 'en', db)).filter(
            app => app.version_id === appVersionIdToUpdate
        )
        expect(updatedApp.version_id).to.equal(appVersionIdToUpdate)
        expect(updatedApp.min_dhis2_version).to.equal('123')
        expect(updatedApp.max_dhis2_version).to.equal('456')
        expect(updatedApp.version).to.equal('789')
        expect(updatedApp.demo_url).to.equal('https://www.google.com')

        //Set back if other tests use the original data
        transaction = await db.transaction()
        await updateAppVersion(
            {
                id: appVersionIdToUpdate,
                userId: app.developer_id,
                minDhisVersion: app.minDhisVersion,
                maxDhisVersion: app.maxDhisVersion,
                version: app.version,
                demoUrl: app.demoUrl,
            },
            transaction
        )
        await transaction.commit()
    })

    it('should be able to switch to another release channel', async () => {
        let transaction = await db.transaction()

        //See seeds/mock/apps.js
        const mockAppId = '2621d406-a908-476a-bcd2-e55abe3445b4'
        const appVersionIdToUpdate = '792aa26c-5595-4ae5-a2f8-028439060e2e'

        //First check that we fetch the correct object to change
        let [app] = (await getAppsById(mockAppId, 'en', db)).filter(
            app => app.version_id === appVersionIdToUpdate
        )
        expect(app.version_id).to.equal(appVersionIdToUpdate)
        expect(app.channel_name).to.equal('Stable')

        await updateAppVersion(
            {
                id: appVersionIdToUpdate,
                channel: 'Development',
                userId: users[0].id,
            },
            transaction
        )

        await transaction.commit()
        ;[app] = (await getAppsById(mockAppId, 'en', db)).filter(
            app => app.version_id === appVersionIdToUpdate
        )
        expect(app.channel_name).to.equal('Development')

        //Change back channel to not break following tests
        transaction = await db.transaction()
        await updateAppVersion(
            {
                id: appVersionIdToUpdate,
                channel: 'Stable',
                userId: users[0].id,
            },
            transaction
        )
        await transaction.commit()

        //Check that the switch back to Stable worked
        ;[app] = (await getAppsById(mockAppId, 'en', db)).filter(
            app => app.version_id === appVersionIdToUpdate
        )
        expect(app.channel_name).to.equal('Stable')
    })

    it('shouldnt be able to switch to a release channel that doesnt exist', async () => {
        //See seeds/mock/apps.js
        const mockAppId = '2621d406-a908-476a-bcd2-e55abe3445b4'
        const appVersionIdToUpdate = '792aa26c-5595-4ae5-a2f8-028439060e2e'

        //First check that we fetch the correct object to change
        const [app] = (await getAppsById(mockAppId, 'en', db)).filter(
            app => app.version_id === appVersionIdToUpdate
        )
        expect(app.version_id).to.equal(appVersionIdToUpdate)
        expect(app.channel_name).to.equal('Stable')

        const transaction = await db.transaction()

        //Try to change to a channel that doesn't exist
        await expect(
            updateAppVersion(
                {
                    id: appVersionIdToUpdate,
                    channel: 'Foobar',
                    userId: users[0].id,
                },
                transaction
            )
        ).to.reject(
            Error,
            'Could not update appversion: 792aa26c-5595-4ae5-a2f8-028439060e2e. Channel Foobar does not exist.'
        )
    })
})

describe('@data::createAppStatus', () => {
    const createAppStatus = require('../../src/data/createAppStatus')

    it('should throw an error if trying to save an app status for an app that doesnt exist', async () => {
        const transaction = await db.transaction()

        await expect(
            createAppStatus(
                {
                    userId: users[0].id,
                    appId: '792aa26c-0000-0000-0000-028439060e2e', //something that doesnt exist in our test database
                    status: 'PENDING',
                },
                transaction
            )
        ).to.reject(
            Error,
            `Could not save app status: PENDING for appId: 792aa26c-0000-0000-0000-028439060e2e. Invalid appId, app does not exist.`
        )
    })

    it('should create an app status PENDING for app with id 1', async () => {
        const transaction = await db.transaction()

        const { id } = await createAppStatus(
            {
                userId: users[0].id,
                appId: apps[0].id,
                status: 'PENDING',
            },
            transaction
        )

        expect(id).to.be.a.string()
    })
})
