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
        const knex = await db.transaction()

        await expect(
            createAppVersion(
                {
                    appId: apps[0].id,
                },
                knex
            )
        ).to.reject(Error, '"userId" is required')
    })

    it('should require appId', async () => {
        const knex = await db.transaction()

        await expect(
            createAppVersion(
                {
                    userId: users[0].id,
                },
                knex
            )
        ).to.reject(Error, '"appId" is required')
    })

    it('should require the specified app to exist', async () => {
        const knex = await db.transaction()

        await expect(
            createAppVersion(
                {
                    userId: users[0].id,
                    appId: '00000000-0000-0000-0000-000000000000',
                },
                knex
            )
        ).to.reject(
            Error,
            `Could not create appversion for appid: 00000000-0000-0000-0000-000000000000, ${users[0].id}, undefined, undefined, undefined. Invalid appId, app does not exist.`
        )
    })

    it('should create a new app version', async () => {
        const knex = await db.transaction()

        const version = await createAppVersion(
            {
                userId: users[0].id,
                appId: apps[0].id,
                demoUrl: 'https://www.dhis2.org',
                sourceUrl: 'https://github.com/dhis2/app-hub/',
                version: '12345',
            },
            knex
        )
        await knex.commit()

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
        const knex = await db.transaction()

        const version = await createAppVersion(
            {
                userId: users[0].id,
                appId: apps[0].id,
            },
            knex
        )
        await knex.commit()

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

    it('should break validation if trying to use a non URI value for demoUrl', async () => {
        const knex = await db.transaction()

        await expect(
            createAppVersion(
                {
                    userId: users[0].id,
                    appId: apps[0].id,
                    demoUrl: 'bla bla bla',
                    version: '7897879879',
                },
                knex
            )
        ).to.reject(Error, '"demoUrl" must be a valid uri')
    })

    it('should break validation if trying to use a non URI value for sourceUrl', async () => {
        const knex = await db.transaction()

        await expect(
            createAppVersion(
                {
                    userId: users[0].id,
                    appId: apps[0].id,
                    sourceUrl: 'bla bla bla',
                    version: '7897879879',
                },
                knex
            )
        ).to.reject(Error, '"sourceUrl" must be a valid uri')
    })
})
