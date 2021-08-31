const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const { it, describe, afterEach, beforeEach, before } = (exports.lab =
    Lab.script())
const knex = require('knex')
const knexConfig = require('../../../knexfile')
const appsMocks = require('../../../seeds/mock/apps')
const appVersions = require('../../../seeds/mock/appversions')
const users = require('../../../seeds/mock/users')
const AppVersionModel = require('../../../src/models/v2/AppVersion')
const { init } = require('../../../src/server/init-server')
const { config } = require('../../../src/server/noauth-config')
const Joi = require('../../../src/utils/CustomJoi')

const dbInstance = knex(knexConfig)
describe('v2/appVersions', () => {
    let server
    let db

    before(() => {
        config.auth.noAuthUserIdMapping = users[0].id
    })

    beforeEach(async () => {
        db = await dbInstance.transaction()

        server = await init(db, config)
    })

    afterEach(async () => {
        await server.stop()

        await db.rollback()
    })

    const dhis2App = appsMocks[0]
    const dhis2AppVersions = appVersions[0]

    describe('get appversions', () => {
        it('should get version for the app', async () => {
            const request = {
                method: 'GET',
                url: `/api/v2/apps/${dhis2App.id}/versions`,
            }

            const res = await server.inject(request)

            expect(res.statusCode).to.equal(200)

            const result = res.result.result

            const resIds = result.map(r => r.id)
            expect(resIds).to.include(dhis2AppVersions.map(v => v.id))
        })

        it('should return a result that complies with AppVersionModel', async () => {
            const request = {
                method: 'GET',
                url: `/api/v2/apps/${dhis2App.id}/versions`,
            }

            const res = await server.inject(request)

            expect(res.statusCode).to.equal(200)

            const result = res.result.result

            Joi.assert(result, Joi.array().items(AppVersionModel.def))

            // check some keys as well
            result.map(v => {
                expect(v.appId).to.be.a.string()
                expect(v.version).to.be.a.string()
                expect(v.minDhisVersion).to.be.a.string()
            })
        })
    })
})
