const { expect } = require('code')

const { lab, server } = require('../index')

const { it, describe } = lab

exports.lab = lab

describe('Get all published apps [v1]', () => {
    it('should return some test-apps from seeded db', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/v1/apps',
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
        expect(whoApp[0].developer.name).to.be.equal('Erik Arenhill')

        expect(whoApp[0].versions[0].version).to.be.equal('1.0')
        expect(whoApp[0].versions[0].demoUrl).to.be.equal(
            'https://play.dhis2.org/2.30/api/apps/Immunization-analysis/index.html#!/report'
        )
        expect(whoApp[0].versions[0].downloadUrl).to.be.equal(
            'http://localhost:3000/v1/apps/download/world-health-organization/a-nice-app-by-who/1.0/app.zip'
        )

        expect(whoApp[0].sourceUrl).to.be.equal(
            'https://github.com/dhis2/who-immunization-analysis-app/'
        )
    })
})

describe('Get all published apps [v2]', () => {
    it('should just return a 501 not implemented for the moment being', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/v2/apps',
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(501)
    })
})

describe('Test auth', () => {
    it('Should deny access without a valid authorisation token', async () => {
        const injectOptions = {
            method: 'GET',
            url: '/v1/apps/all',
        }

        const response = await server.inject(injectOptions)

        expect(response.statusCode).to.be.equal(401)
    })
})
