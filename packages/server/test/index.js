// load deps
const { expect } = require('code')

const lab = exports.lab = require('lab').script()
const { it, describe, beforeEach, afterEach, before, after } = lab

// prepare environment
const { server } = require('../src/main.js')

console.log('Tests are running in env: ' + process.env.NODE_ENV)

//const joi = require('joi')

/*const def = joi.object().keys({
    a: joi.number().required(),
    b: joi.number().required()
}).options({ stripUnknown: true })

describe('Test joi schema validation', () => {

    it('should allow to pass an object extending the schema',  () => {

        const result = joi.validate({ a: 1, b: 2, c: 3 }, def)
        expect(result.error).to.be.null()
    })

})*/

describe('Test auth', () => {

    it('Should deny access without a valid authorisation token', async () => {

        const injectOptions = {
            method: 'GET',
            url: '/v1/apps/all'
        }

        const response = await server.inject(injectOptions)

        expect(response.statusCode).to.be.equal(401)

    })
})

describe('Test validations parameter objects', () => {

    const addAppVersionToChannelAsync = require('@data/addAppVersionToChannelAsync')

    const knex = require('knex')
    const mockKnex = require('mock-knex')

    const db = knex({
        client: 'postgres'
    })

    //const tracker = mockKnex.getTracker()
    mockKnex.mock(db)

    //tracker.install()
    /*tracker.on('query', (query) => {
        expect(query.transacting).to.be.false()
        resolve()
    })*/

/*    it('should fail if not sending all required parameters', (flags) => {

        return new Promise((resolve) => {
            db.transaction(async (trx) => {

                const result = await addAppVersionToChannelAsync({
                    appVersionId: 1,
                    createdByUserId: 1,
                    channelName: 'A',
                    minDhisVersion : 'B',
                    maxDhisVersion: ''
                }, db, trx)

                expect(result).to.not.be.null()
                resolve()
            })
        })
    })*/
})



describe('Get all published apps [v1]', () => {

    it('should return some test-apps from seeded db', async () => {

        const injectOptions = {
            method: 'GET',
            url: '/v1/apps'
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)

        const apps = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()

        const approvedApps = apps.filter((app) => app.status === 'APPROVED');
        expect(approvedApps.length).to.be.equal(apps.length)

        const whoApp = apps.filter((app) => app.name === 'A nice app by WHO')

        expect(whoApp).to.be.array()

        expect(whoApp[0].developer.email).to.be.equal('erik@dhis2.org')
        expect(whoApp[0].developer.organisation).to.be.equal('World Health Organization')
        expect(whoApp[0].developer.name).to.be.equal('Erik Arenhill')

        expect(whoApp[0].versions[0].version).to.be.equal('1.0')
        expect(whoApp[0].versions[0].demoUrl).to.be.equal('https://play.dhis2.org/2.30/api/apps/Immunization-analysis/index.html#!/report')
        expect(whoApp[0].versions[0].downloadUrl).to.be.equal('http://localhost:3000/v1/apps/download/world-health-organization/a-nice-app-by-who/1.0/app.zip')

        expect(whoApp[0].sourceUrl).to.be.equal('https://github.com/dhis2/who-immunization-analysis-app/')
    })
})


describe('Get all published apps [v2]', () => {

    it('should just return a 501 not implemented for the moment being', async () => {

        const injectOptions = {
            method: 'GET',
            url: '/v2/apps'
        }

        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(501)

        const apps = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()
    })
})
