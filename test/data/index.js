const Lab = require('@hapi/lab')

// prepare environment
const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

const { ImageType } = require('../../src/enums')
const {
    addAppVersionMedia,
    getAppsByUuid,
    createApp,
    getAppById,
} = require('../../src/data')

describe('@data::addAppVersionMedia', () => {
    it('Should throw an error if config object does not pass validation', async () => {
        await expect(addAppVersionMedia({}, null, null)).to.reject(
            Error,
            'ValidationError: "appVersionId" is required'
        )
    })

    it('should add appmedia successfully', async () => {
        const appMedia = {
            appVersionId: 1, //DHIS2 app
            userId: 1, //travis user
            imageType: ImageType.Screenshot,
            fileName: 'screenshot.jpg',
            mime: 'image/jpeg',
            caption: 'Test caption',
            description: 'a description',
        }
        const trx = await db.transaction()
        const { id, uuid } = await addAppVersionMedia(appMedia, db, trx)
        await trx.commit()
        expect(id)
            .to.be.number()
            .min(1)
        expect(uuid.length).to.be.equal(36)

        const appWithVersion = await getAppById(1, 'en', db)
        const mediaApp = appWithVersion.find(
            a => a.version_id === 1 && a.media_id === id
        )
        expect(mediaApp).to.not.be.null()

        expect(mediaApp.media_caption).to.be.equal(appMedia.caption)
        expect(mediaApp.media_description).to.be.equal(appMedia.description)
    })
})

describe('@data::getAppsByUuid', () => {
    it('should require uuid parameter', async () => {
        await expect(getAppsByUuid(null, 'sv', null)).to.reject(
            Error,
            `Missing parameter 'uuid'`
        )
    })

    it('should require languagecode parameter', async () => {
        await expect(getAppsByUuid('1234', null, null)).to.reject(
            Error,
            `Missing parameter 'languageCode'`
        )
    })

    it('should require knex parameter', async () => {
        await expect(getAppsByUuid('1234', 'sv', null)).to.reject(
            Error,
            `Missing parameter 'knex'`
        )
    })
})

describe('@data::createApp', () => {
    it('should require userId parameter and it to be a number', async () => {
        await expect(createApp({}, null, null)).to.reject(Error)

        await expect(createApp({ userId: '' }, null, null)).to.reject(Error)
    })

    it('should require orgId parameter and it to be a number', async () => {
        const config = {
            userId: 1,
        }

        await expect(createApp(config, null, null)).to.reject(Error)

        await expect(createApp({ ...config, orgId: '' }, null, null)).to.reject(
            Error
        )
    })
})

describe('@data::getOrganisation', () => {
    const {
        getOrganisationByUuid,
        getOrganisationsByName,
    } = require('../../src/data')

    it('should throw an error passing invalid uuid', async () => {
        await expect(getOrganisationByUuid('asdf', db)).to.reject(Error)
    })

    it('get the organisation with the specified uuid', async () => {
        console.log('db:', db)
        const [dhis2Org] = await getOrganisationsByName('DHIS2', db)
        expect(dhis2Org).to.not.be.null()

        const dhis2OrgByUuid = await getOrganisationByUuid(dhis2Org.uuid, db)
        expect(dhis2OrgByUuid).to.not.be.null()

        expect(dhis2Org.id).to.equal(dhis2OrgByUuid.id)
    })

    it('get the organisation named DHIS2', async () => {
        const [dhis2Org] = await getOrganisationsByName('DHIS2', db)

        expect(dhis2Org).to.not.be.null()
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
                userId: 1,
                name: 'Test create organisation åäöèé',
            },
            db,
            transaction
        )

        await transaction.commit()

        expect(org.id)
            .to.be.a.number()
            .min(1)

        expect(org.uuid.length).to.be.equal(36)
        expect(org.slug).to.equal('test-create-organisation-aaoee')
        expect(org.name).to.equal('Test create organisation åäöèé')

        const [shouldExist] = await getOrganisationsByName(org.name, db)
        expect(shouldExist.id).to.be.equal(org.id)
        expect(shouldExist.uuid).to.be.equal(org.uuid)
        expect(shouldExist.name).to.be.equal(org.name)
        expect(shouldExist.slug).to.be.equal(org.slug)

        //Delete then try to fetch again.
        transaction = await db.transaction()
        const successfullyDeleted = await deleteOrganisation(
            { uuid: org.uuid },
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

        expect(id)
            .to.be.number()
            .min(1)
    })
})

describe('@data::addUserToOrganisation', () => {
    const {
        addUserToOrganisation,
        getOrganisationsByName,
        createOrganisation,
    } = require('../../src/data')

    it('should add a user to an organisation without throwing', async () => {
        const transaction = await db.transaction()

        const org = await createOrganisation(
            { userId: 1, name: 'A new organisation' },
            db,
            transaction
        )

        await addUserToOrganisation(
            { userId: 1, organisationId: org.id },
            db,
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
        expect(firstApp.uuid).to.not.be.null()

        const { uuid } = firstApp

        const newData = {
            uuid: firstApp.uuid,
            userId: firstApp.developer_id,
            name: 'Changed name',
            sourceUrl: 'https://some/url',
            demoUrl: 'http://some/other/url',
            description: 'Changed description',
            languageCode: 'en',
        }

        await updateApp(newData, db, transaction)

        await transaction.commit()

        const allAppVersionsWithUuid = await getAppsByUuid(uuid, 'en', db)

        expect(allAppVersionsWithUuid.length).to.be.min(1)

        allAppVersionsWithUuid.forEach(app => {
            expect(app.name).to.be.equal(newData.name)
            expect(app.source_url).to.be.equal(newData.sourceUrl)
            expect(app.description).to.be.equal(newData.description)
        })
    })
})

describe('@data::updateAppVersion', () => {
    const { updateAppVersion, getAppById } = require('../../src/data')

    it('should update the app version', async () => {
        let transaction = await db.transaction()

        //See seeds/mock/apps.js
        const mockAppUuid = '2621d406-a908-476a-bcd2-e55abe3445b4'
        const appVersionUuidToUpdate = '792aa26c-5595-4ae5-a2f8-028439060e2e'

        //First check that we fetch the correct object to change
        const [app] = (await getAppsByUuid(mockAppUuid, 'en', db)).filter(
            app => app.version_uuid === appVersionUuidToUpdate
        )
        expect(app.version_uuid).to.equal(appVersionUuidToUpdate)
        expect(app.version).to.equal('0.1')
        expect(app.max_dhis2_version).to.equal(null)
        expect(app.min_dhis2_version).to.equal('2.28')
        expect(app.demo_url).to.equal(null)

        await updateAppVersion(
            {
                uuid: appVersionUuidToUpdate,
                userId: app.developer_id,
                minDhisVersion: '123',
                maxDhisVersion: '456',
                version: '789',
                demoUrl: 'https://www.google.com',
            },
            db,
            transaction
        )

        await transaction.commit()

        const [updatedApp] = (await getAppsByUuid(
            mockAppUuid,
            'en',
            db
        )).filter(app => app.version_uuid === appVersionUuidToUpdate)
        expect(updatedApp.version_uuid).to.equal(appVersionUuidToUpdate)
        expect(updatedApp.min_dhis2_version).to.equal('123')
        expect(updatedApp.max_dhis2_version).to.equal('456')
        expect(updatedApp.version).to.equal('789')
        expect(updatedApp.demo_url).to.equal('https://www.google.com')

        //Set back if other tests use the original data
        transaction = await db.transaction()
        await updateAppVersion(
            {
                uuid: appVersionUuidToUpdate,
                userId: app.developer_id,
                minDhisVersion: app.minDhisVersion,
                maxDhisVersion: app.maxDhisVersion,
                version: app.version,
                demoUrl: app.demoUrl,
            },
            db,
            transaction
        )
        await transaction.commit()
    })

    it('should be able to switch to another release channel', async () => {
        let transaction = await db.transaction()

        //See seeds/mock/apps.js
        const mockAppUuid = '2621d406-a908-476a-bcd2-e55abe3445b4'
        const appVersionUuidToUpdate = '792aa26c-5595-4ae5-a2f8-028439060e2e'

        //First check that we fetch the correct object to change
        let [app] = (await getAppsByUuid(mockAppUuid, 'en', db)).filter(
            app => app.version_uuid === appVersionUuidToUpdate
        )
        expect(app.version_uuid).to.equal(appVersionUuidToUpdate)
        expect(app.channel_name).to.equal('Stable')

        await updateAppVersion(
            {
                uuid: appVersionUuidToUpdate,
                channel: 'Development',
            },
            db,
            transaction
        )

        await transaction.commit()
        ;[app] = (await getAppsByUuid(mockAppUuid, 'en', db)).filter(
            app => app.version_uuid === appVersionUuidToUpdate
        )
        expect(app.channel_name).to.equal('Development')

        //Change back channel to not break following tests
        transaction = await db.transaction()
        await updateAppVersion(
            {
                uuid: appVersionUuidToUpdate,
                channel: 'Stable',
            },
            db,
            transaction
        )
        await transaction.commit()

        //Check that the switch back to Stable worked
        ;[app] = (await getAppsByUuid(mockAppUuid, 'en', db)).filter(
            app => app.version_uuid === appVersionUuidToUpdate
        )
        expect(app.channel_name).to.equal('Stable')
    })

    it('shouldnt be able to switch to a release channel that doesnt exist', async () => {
        //See seeds/mock/apps.js
        const mockAppUuid = '2621d406-a908-476a-bcd2-e55abe3445b4'
        const appVersionUuidToUpdate = '792aa26c-5595-4ae5-a2f8-028439060e2e'

        //First check that we fetch the correct object to change
        const [app] = (await getAppsByUuid(mockAppUuid, 'en', db)).filter(
            app => app.version_uuid === appVersionUuidToUpdate
        )
        expect(app.version_uuid).to.equal(appVersionUuidToUpdate)
        expect(app.channel_name).to.equal('Stable')

        const transaction = await db.transaction()

        //Try to change to a channel that doesn't exist
        await expect(
            updateAppVersion(
                {
                    uuid: appVersionUuidToUpdate,
                    channel: 'Foobar',
                },
                db,
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

    it('should throw an error if no transaction is passed', async () => {
        await expect(createAppStatus({}, db)).to.reject(
            Error,
            'No transaction passed to function'
        )
    })

    it('should throw an error if trying to save an app status for an app that doesnt exist', async () => {
        const transaction = await db.transaction()

        await expect(
            createAppStatus(
                {
                    userId: 1,
                    appId: 999999, //something that doesnt exist in our test database
                    status: 'PENDING',
                },
                db,
                transaction
            )
        ).to.reject(
            Error,
            `Could not save app status: PENDING for appId: 999999. Invalid appId, app does not exist.`
        )
    })

    it('should create an app status PENDING for app with id 1', async () => {
        const transaction = await db.transaction()

        const { id } = await createAppStatus(
            {
                userId: 1,
                appId: 1, //something that doesnt exist in our test database
                status: 'PENDING',
            },
            db,
            transaction
        )

        expect(id)
            .to.be.a.number()
            .greaterThan(0)
    })
})

describe('@data::createAppVersion', () => {
    const createAppVersion = require('../../src/data/createAppVersion')

    it('should require userId', async () => {
        const transaction = await db.transaction()

        await expect(
            createAppVersion(
                {
                    appId: 1,
                },
                db,
                transaction
            )
        ).to.reject(Error, 'ValidationError: "userId" is required')
    })

    it('should require appId', async () => {
        const transaction = await db.transaction()

        await expect(
            createAppVersion(
                {
                    userId: 1,
                },
                db,
                transaction
            )
        ).to.reject(Error, 'ValidationError: "appId" is required')
    })

    it('should require a transaction', async () => {
        await expect(
            createAppVersion(
                {
                    userId: 1,
                    appId: 1,
                },
                db
            )
        ).to.reject(Error, 'No transaction passed to function')
    })

    it('should require the specified app to exist', async () => {
        const transaction = await db.transaction()

        await expect(
            createAppVersion(
                {
                    userId: 1,
                    appId: 99999,
                },
                db,
                transaction
            )
        ).to.reject(
            Error,
            'Could not create appversion for appid: 99999, 1, undefined, undefined, undefined. Invalid appId, app does not exist.'
        )
    })

    it('should create a new app version', async () => {
        const transaction = await db.transaction()

        const version = await createAppVersion(
            {
                userId: 1,
                appId: 1,
                demoUrl: 'https://www.dhis2.org',
                sourceUrl: 'https://github.com/dhis2/app-store/',
                version: '12345',
            },
            db,
            transaction
        )
        await transaction.commit()

        expect(version).to.not.be.null()
        expect(version.uuid).to.exist()
        expect(version.id).to.exist()
        expect(version.id)
            .to.be.a.number()
            .greaterThan(0)

        const dbAppVersion = await db('app_version')
            .select()
            .where('id', version.id)
            .first()

        expect(dbAppVersion.id).to.equal(version.id)
        expect(dbAppVersion.uuid).to.equal(version.uuid)

        expect(dbAppVersion.demo_url).to.equal(version.demoUrl)
        expect(dbAppVersion.source_url).to.equal(version.sourceUrl)
        expect(dbAppVersion.version).to.equal(version.version)
        expect(dbAppVersion.created_by_user_id).to.equal(version.userId)
        expect(dbAppVersion.app_id).to.equal(version.appId)
    })

    it('should create a new app version with default values for demoUrl, sourceUrl and version', async () => {
        const transaction = await db.transaction()

        const version = await createAppVersion(
            {
                userId: 1,
                appId: 1,
            },
            db,
            transaction
        )
        await transaction.commit()

        expect(version).to.not.be.null()
        expect(version.uuid).to.exist()
        expect(version.id).to.exist()
        expect(version.id)
            .to.be.a.number()
            .greaterThan(0)

        const dbAppVersion = await db('app_version')
            .select()
            .where('id', version.id)
            .first()

        expect(dbAppVersion.id).to.equal(version.id)
        expect(dbAppVersion.uuid).to.equal(version.uuid)

        expect(dbAppVersion.demo_url).to.be.empty()
        expect(dbAppVersion.source_url).to.be.empty()
        expect(dbAppVersion.version).to.be.empty()
        expect(dbAppVersion.created_by_user_id).to.equal(version.userId)
        expect(dbAppVersion.app_id).to.equal(version.appId)
    })
})
