const { expect } = require('code')

const { lab, db } = require('../index')

const { it, describe } = lab

const { addAppVersionMedia, getAppsByUuid, createApp } = require('@data')

describe('@data::addAppVersionMedia', () => {
    it('Should throw an error if config object does not pass validation', async () => {
        await expect(addAppVersionMedia({}, null, null)).to.reject(
            Error,
            'ValidationError: child "appVersionId" fails because ["appVersionId" is required]'
        )
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
    const { getOrganisationByUuid, getOrganisationsByName } = require('@data')

    it('should throw an error passing invalid uuid', async () => {
        await expect(getOrganisationByUuid('asdf', db)).to.reject(Error)
    })

    it('get the organisation with the specified uuid', async () => {
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
        createTransaction,
    } = require('@data')

    it('should create an organisation and then delete it', async () => {
        let transaction = await createTransaction(db)

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
        transaction = await createTransaction(db)
        const successfullyDeleted = await deleteOrganisation(
            { uuid: org.uuid },
            db,
            transaction
        )
        transaction.commit()

        expect(successfullyDeleted).to.be.true()

        const organisationsWithName = await getOrganisationsByName(org.name, db)
        expect(organisationsWithName).to.be.empty()
    })
})

describe('@data::createUser', () => {
    const { createUser, createTransaction } = require('@data')

    it('should create a new user', async () => {
        let transaction = await createTransaction(db)

        const { id } = await createUser(
            {
                email: 'test@test.com',
            },
            db,
            transaction
        )

        transaction.commit()

        expect(id)
            .to.be.number()
            .min(1)
    })
})

describe('@data::addUserToOrganisation', () => {
    const {
        addUserToOrganisation,
        createTransaction,
        getOrganisationsByName,
        createOrganisation,
    } = require('@data')

    it('should add a user to an organisation without throwing', async () => {
        let transaction = await createTransaction(db)

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

        transaction.commit()
    })
})

describe('@data::updateApp', () => {
    const {
        updateApp,
        createTransaction,
        getAllAppsByLanguage,
    } = require('@data')

    it('should update the app', async () => {
        const transaction = await createTransaction(db)

        let allApps = await getAllAppsByLanguage('en', db)

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
    const { updateAppVersion, createTransaction, getAppById } = require('@data')

    it('should update the app version', async () => {
        let transaction = await createTransaction(db)

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
        transaction = await createTransaction(db)
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
        transaction.commit()
    })
})
