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
                expect(v.downloadUrl).to.be.a.string()
            })
        })

        it('should work with paging params', async () => {
            const request = {
                method: 'GET',
                url: `/api/v2/apps/${dhis2App.id}/versions?pageSize=2`,
            }

            const res = await server.inject(request)

            expect(res.statusCode).to.equal(200)

            const result = res.result
            const versions = res.result.result

            Joi.assert(versions, Joi.array().items(AppVersionModel.def))
            expect(result.pager).to.be.an.object()
            expect(result.pager.pageSize).to.equal(2)
            expect(versions.length).to.equal(2)
            // check some keys as well
            versions.map(v => {
                expect(v.appId).to.be.a.string()
                expect(v.version).to.be.a.string()
                expect(v.minDhisVersion).to.be.a.string()
            })
        })

        describe('with filters', () => {
            it('should handle channel filter', async () => {
                const request = {
                    method: 'GET',
                    url: `/api/v2/apps/${dhis2App.id}/versions?channel=development`,
                }

                const res = await server.inject(request)

                expect(res.statusCode).to.equal(200)

                const result = res.result
                const versions = res.result.result

                Joi.assert(versions, Joi.array().items(AppVersionModel.def))
                expect(result.pager).to.be.an.object()
                // check some keys as well
                versions.forEach(v => {
                    expect(v.appId).to.be.a.string()
                    expect(v.version).to.be.a.string()
                    expect(v.channel).to.be.equal('development')
                })
            })

            it('should handle minDhisVersion', async () => {
                const request = {
                    method: 'GET',
                    url: `/api/v2/apps/${dhis2App.id}/versions?minDhisVersion=eq:2.29`,
                }

                const res = await server.inject(request)

                expect(res.statusCode).to.equal(200)

                const result = res.result
                const versions = result.result

                Joi.assert(versions, Joi.array().items(AppVersionModel.def))
                versions.forEach(v => {
                    expect(v.appId).to.be.a.string()
                    expect(v.version).to.be.a.string()
                    expect(v.minDhisVersion).to.be.equal('2.29')
                })
            })

            it('should handle minDhisVersion with lte and gte', async () => {
                const request = {
                    method: 'GET',
                    url: `/api/v2/apps/${dhis2App.id}/versions?minDhisVersion=lte:2.28`,
                }

                const res = await server.inject(request)

                expect(res.statusCode).to.equal(200)

                const result = res.result
                const versions = result.result

                Joi.assert(versions, Joi.array().items(AppVersionModel.def))
                versions.forEach(v => {
                    expect(v.appId).to.be.a.string()
                    expect(v.version).to.be.a.string()
                    expect(v.minDhisVersion).to.be.below('2.29')
                })
            })

            it('should handle maxDhisVersion', async () => {
                const request = {
                    method: 'GET',
                    url: `/api/v2/apps/${dhis2App.id}/versions?maxDhisVersion=lte:2.34`,
                }

                const res = await server.inject(request)

                expect(res.statusCode).to.equal(200)

                const result = res.result
                const versions = result.result

                expect(versions.length).to.be.above(0)
                Joi.assert(versions, Joi.array().items(AppVersionModel.def))
                versions.forEach(v => {
                    expect(v.appId).to.be.a.string()
                    expect(v.version).to.be.a.string()
                    if (v.maxDhisVersion) {
                        const [, major] = v.maxDhisVersion
                            .split('.')
                            .map(Number)
                        expect(major).to.be.lessThan(35)
                    }
                })
            })

            it('should handle both minDhisVersion and maxDhisVersion', async () => {
                const request = {
                    method: 'GET',
                    url: `/api/v2/apps/${dhis2App.id}/versions?maxDhisVersion=lte:2.34&minDhisVersion=gte:2.29`,
                }

                const res = await server.inject(request)

                expect(res.statusCode).to.equal(200)

                const result = res.result
                const versions = result.result

                expect(versions.length).to.be.above(0)
                Joi.assert(versions, Joi.array().items(AppVersionModel.def))
                versions.forEach(v => {
                    expect(v.appId).to.be.a.string()
                    expect(v.version).to.be.a.string()
                    if (v.maxDhisVersion) {
                        const [, major] = v.maxDhisVersion
                            .split('.')
                            .map(Number)
                        expect(major).to.be.between(28, 35)
                    }
                })
            })

            it('should not fail when version include valid semver tags', async () => {
                const request = {
                    method: 'GET',
                    url: `/api/v2/apps/${dhis2App.id}/versions?maxDhisVersion=lte:2.34-beta&minDhisVersion=gte:2.29-alpha`,
                }

                const res = await server.inject(request)

                expect(res.statusCode).to.equal(200)

                const result = res.result
                const versions = result.result

                expect(versions.length).to.be.above(0)
                Joi.assert(versions, Joi.array().items(AppVersionModel.def))
                versions.forEach(v => {
                    expect(v.appId).to.be.a.string()
                    expect(v.version).to.be.a.string()
                    if (v.maxDhisVersion) {
                        const [, major] = v.maxDhisVersion
                            .split('.')
                            .map(Number)
                        expect(major).to.be.between(28, 35)
                    }
                })
            })

            it('should work with same version, returning a range', async () => {
                const compatVersion = '2.30'
                const request = {
                    method: 'GET',
                    url: `/api/v2/apps/${dhis2App.id}/versions?minDhisVersion=lte:${compatVersion}&maxDhisVersion=gte:${compatVersion}`,
                }

                const res = await server.inject(request)

                expect(res.statusCode).to.equal(200)

                const result = res.result
                const versions = result.result

                expect(versions.length).to.be.above(0)

                Joi.assert(versions, Joi.array().items(AppVersionModel.def))
                versions.forEach(v => {
                    expect(v.appId).to.be.a.string()
                    expect(v.version).to.be.a.string()
                    expect(v.minDhisVersion).to.be.below(31)
                    if (v.maxDhisVersion) {
                        const [, major] = v.maxDhisVersion
                            .split('.')
                            .map(Number)
                        expect(major).to.be.greaterThan(29)
                    }
                })
            })

            it('should work with patch versions', async () => {
                const request = {
                    method: 'GET',
                    url: `/api/v2/apps/${dhis2App.id}/versions?minDhisVersion=gte:2.31.10&maxDhisVersion=gte:2.33.0`,
                }

                const res = await server.inject(request)

                expect(res.statusCode).to.equal(200)

                const result = res.result
                const versions = result.result

                expect(versions.length).to.be.above(0)

                Joi.assert(versions, Joi.array().items(AppVersionModel.def))
                versions.forEach(v => {
                    expect(v.appId).to.be.a.string()
                    expect(v.version).to.be.a.string()
                    if (v.maxDhisVersion) {
                        const [, major] = v.maxDhisVersion
                            .split('.')
                            .map(Number)
                        major && expect(major).to.be.above(32)
                    }
                })
            })

            it('should work with maxDhisVersion if app has empty maxDhisVersion', async () => {
                const allVersionsReq = {
                    url: `/api/v2/apps/${dhis2App.id}/versions`,
                }

                const allVersionRes = await server.inject(allVersionsReq)

                expect(allVersionRes.statusCode).to.equal(200)
                const allVersions = allVersionRes.result.result
                expect(allVersions.length).to.above(3) // should have at atleast 4 versions

                const emptyValues = [null, '']
                const countEmptyMaxVersion = (acc, curr) =>
                    emptyValues.includes(curr.maxDhisVersion) ? acc + 1 : acc

                const totalEmptyCount = allVersions.reduce(
                    countEmptyMaxVersion,
                    0
                )

                const request = {
                    method: 'GET',
                    url: `/api/v2/apps/${dhis2App.id}/versions?maxDhisVersion=gte:2.37`,
                }

                const res = await server.inject(request)

                expect(res.statusCode).to.equal(200)

                const result = res.result
                const versions = result.result

                expect(versions.length).to.be.above(0)

                Joi.assert(versions, Joi.array().items(AppVersionModel.def))

                // check that it still returns empty maxDhisVersions
                const emptyCount = versions.reduce(countEmptyMaxVersion, 0)
                expect(emptyCount).to.equal(totalEmptyCount)
            })
        })
    })
})
