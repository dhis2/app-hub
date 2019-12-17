const Lab = require('@hapi/lab')

const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

const users = require('../../seeds/mock/users')
const apps = require('../../seeds/mock/apps')

describe('@data::createAppVersion', () => {
    const createAppVersion = require('../../src/data/createAppVersion')

    it('should require userId', async () => {
        const transaction = await db.transaction()

        await expect(
            createAppVersion(
                {
                    appId: apps[0].id,
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
                    userId: users[0].id,
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
                    userId: users[0].id,
                    appId: apps[0].id,
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
                    userId: users[0].id,
                    appId: '00000000-0000-0000-0000-000000000000',
                },
                db,
                transaction
            )
        ).to.reject(
            Error,
            `Could not create appversion for appid: 00000000-0000-0000-0000-000000000000, ${users[0].id}, undefined, undefined, undefined. Invalid appId, app does not exist.`
        )
    })

    it('should create a new app version', async () => {
        const transaction = await db.transaction()

        const version = await createAppVersion(
            {
                userId: users[0].id,
                appId: apps[0].id,
                demoUrl: 'https://www.dhis2.org',
                sourceUrl: 'https://github.com/dhis2/app-hub/',
                version: '12345',
            },
            db,
            transaction
        )
        await transaction.commit()

        expect(version).to.not.be.null()
        expect(version.id).to.exist()
        expect(version.id.length).to.be.equal(36)

        const dbAppVersion = await db('app_version')
            .select()
            .where('id', version.id)
            .first()

        expect(dbAppVersion.id).to.equal(version.id)

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
                userId: users[0].id,
                appId: apps[0].id,
            },
            db,
            transaction
        )
        await transaction.commit()

        expect(version).to.not.be.null()
        expect(version.id).to.exist()
        expect(version.id.length).to.be.equal(36)

        const dbAppVersion = await db('app_version')
            .select()
            .where('id', version.id)
            .first()

        expect(dbAppVersion.id).to.equal(version.id)

        expect(dbAppVersion.demo_url).to.be.empty()
        expect(dbAppVersion.source_url).to.be.empty()
        expect(dbAppVersion.version).to.be.empty()
        expect(dbAppVersion.created_by_user_id).to.equal(version.userId)
        expect(dbAppVersion.app_id).to.equal(version.appId)
    })
})
