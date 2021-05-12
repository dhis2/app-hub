const Lab = require('@hapi/lab')

// prepare environment
const { it, describe, beforeEach, afterEach } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

const { init } = require('../../src/server/init-server')
const { flatten } = require('../../src/utils')

const { config } = require('../../src/server/env-config')
const appVersionMocks = require('../../seeds/mock/appversions')

describe('Get all published apps [v1]', async () => {
    let server
    beforeEach(async () => {
        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()
    })

    it('should return some test-apps from seeded db', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/api/v1/apps',
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)

        const apps = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()

        const approvedApps = apps.filter(app => app.status === 'APPROVED')
        expect(approvedApps.length).to.be.equal(apps.length)

        const whoApp = apps.filter(app => app.name === 'A nice app by WHO')

        expect(whoApp).to.be.array()

        expect(whoApp[0].developer.email).to.be.equal('erik@dhis2.org')
        expect(whoApp[0].developer.organisation).to.be.equal(
            'World Health Organization'
        )

        expect(whoApp[0].versions[0].version).to.be.equal('1.0')
        expect(whoApp[0].versions[0].demoUrl).to.be.equal(
            'https://play.dhis2.org/2.30/api/apps/Immunization-analysis/index.html#!/report'
        )
        expect(whoApp[0].versions[0].downloadUrl).to.be.equal(
            'http://localhost:3000/api/v1/apps/download/world-health-organization/a-nice-app-by-who_1.0.zip'
        )

        expect(whoApp[0].sourceUrl).to.be.equal(
            'https://github.com/dhis2/who-immunization-analysis-app/'
        )
    })

    it('should only return apps from the stable channel', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/api/v1/apps?channel=stable',
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)

        const apps = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()
        expect(apps).to.be.array()

        const versions = flatten(apps.map(app => app.versions))
        const filteredVersions = versions.filter(
            version => version.channel === 'stable'
        )
        expect(filteredVersions.length).to.equal(versions.length)
    })

    it('should only return apps from the stable channel supporting version 2.27', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/api/v1/apps?channel=stable&dhis_version=2.27',
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)

        const apps = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()
        expect(apps).to.be.array()

        const versions = flatten(apps.map(app => app.versions))

        const filteredVersions = versions.filter(
            version => version.channel === 'stable'
        )
        expect(filteredVersions.length).to.equal(versions.length)

        //the 'a nice app by who' version 1.0 with support for 2.27
        expect(filteredVersions[0].maxDhisVersion).to.equal(null)
        expect(filteredVersions[0].minDhisVersion).to.equal('2.27')
    })

    it('should only return apps supporting version 2.27', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/api/v1/apps?channel=All&dhis_version=2.27',
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)

        const apps = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()
        expect(apps).to.be.array()

        const versions = flatten(apps.map(app => app.versions))
        expect(versions.length).to.equal(1)

        //the 'a nice app by who' version 1.0 with support for 2.27
        expect(versions[0].maxDhisVersion).to.equal(null)
        expect(versions[0].minDhisVersion).to.equal('2.27')
    })

    it('should be able to load the details of an approved app', async () => {
        const mockedApps = require('../../seeds/mock/apps')
        const firstMockedApp = mockedApps[0]

        const injectOptions = {
            method: 'GET',
            url: `/api/v1/apps/${firstMockedApp.id}`,
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)
    })

    it('should not able to load the details of a pending app when unauthenticated', async () => {
        const mockedApps = require('../../seeds/mock/apps')
        const pendingApp = mockedApps[3]

        const injectOptions = {
            method: 'GET',
            url: `/api/v1/apps/${pendingApp.id}`,
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(404)
    })
})

describe('Get all published apps [v2]', () => {
    let server
    beforeEach(async () => {
        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()
    })

    it('should return some test-apps from seeded db', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/api/v2/apps',
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)

        const { result: apps } = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()

        const approvedApps = apps.filter(app => app.status === 'APPROVED')
        expect(approvedApps.length).to.be.equal(apps.length)

        const whoApp = apps.filter(app => app.name === 'A nice app by WHO')

        expect(whoApp).to.be.array()

        expect(whoApp[0].developer.email).to.be.equal('erik@dhis2.org')
        expect(whoApp[0].developer.organisation).to.be.equal(
            'World Health Organization'
        )
        const version1App = whoApp[0].versions.find(
            ver => ver.id === appVersionMocks[1][0].id
        )
        expect(version1App.version).to.be.equal('1.0')
        expect(version1App.demoUrl).to.be.equal(
            'https://play.dhis2.org/2.30/api/apps/Immunization-analysis/index.html#!/report'
        )
        expect(version1App.downloadUrl).to.be.equal(
            'http://localhost:3000/api/v1/apps/download/world-health-organization/a-nice-app-by-who_1.0.zip'
        )

        expect(whoApp[0].sourceUrl).to.be.equal(
            'https://github.com/dhis2/who-immunization-analysis-app/'
        )
    })

    it('should only return apps from the stable channel', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/api/v2/apps?channels=stable',
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)

        const { result: apps } = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()
        expect(apps).to.be.array()

        const versions = flatten(apps.map(app => app.versions))
        const filteredVersions = versions.filter(
            version => version.channel === 'stable'
        )
        expect(filteredVersions.length).to.equal(versions.length)
    })

    it('should only return apps from the stable channel supporting version 2.27', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/api/v2/apps?channels=stable&dhis_version=2.27',
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)

        const { result: apps } = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()
        expect(apps).to.be.array()

        const versions = flatten(apps.map(app => app.versions))

        const filteredVersions = versions.filter(
            version => version.channel === 'stable'
        )
        expect(filteredVersions.length).to.equal(versions.length)

        //the 'a nice app by who' version 1.0 with support for 2.27
        expect(filteredVersions[0].maxDhisVersion).to.equal(null)
        expect(filteredVersions[0].minDhisVersion).to.equal('2.27')
    })

    it('should only return apps supporting version 2.27', async () => {
        const injectOptions = {
            method: 'GET',
            url:
                '/api/v2/apps?channels=stable,development,canary&dhis_version=2.27',
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)

        const { result: apps } = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()
        expect(apps).to.be.array()

        const versions = flatten(apps.map(app => app.versions))
        expect(versions.length).to.equal(1)

        //the 'a nice app by who' version 1.0 with support for 2.27
        expect(versions[0].maxDhisVersion).to.equal(null)
        expect(versions[0].minDhisVersion).to.equal('2.27')
    })
})

describe('Test auth', () => {
    let server
    beforeEach(async () => {
        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()
    })

    it('Should deny access without a valid authorisation token', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/api/v1/apps/all',
        }

        const response = await server.inject(injectOptions)

        expect(response.statusCode).to.be.equal(401)
    })
})

describe('Make sure the unversioned api fallback to v1', () => {
    let server
    beforeEach(async () => {
        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()
    })

    it('should return the same json on /api/v1/apps and /api/apps', async () => {
        const unversionedResponse = await server.inject({
            method: 'GET',
            url: '/api/apps',
        })

        const versionedResponse = await server.inject({
            method: 'GET',
            url: '/api/v1/apps',
        })

        expect(unversionedResponse.statusCode).to.equal(200)
        expect(versionedResponse.statusCode).to.equal(200)

        expect(unversionedResponse.payload).to.be.equal(
            versionedResponse.payload
        )
    })
})

describe('Test that swagger endpoints work', () => {
    let server
    beforeEach(async () => {
        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()
    })

    it('should return status 200 when requesting /swagger.json', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/swagger.json',
        })

        expect(response.statusCode).to.equal(200)
    })

    it('should return status 200 when requesting /documentation', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/documentation',
        })

        expect(response.statusCode).to.equal(200)
    })
})
