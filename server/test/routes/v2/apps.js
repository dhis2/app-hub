const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const AdmZip = require('adm-zip')
const FormData = require('form-data')
const Knex = require('knex')
const streamToPromise = require('stream-to-promise')
const { it, describe, afterEach, beforeEach, after, before } = (exports.lab =
    Lab.script())
const {
    createAppVersionForm,
} = require('../../../../tools/helpers/generateAppVersion')
const knexConfig = require('../../../knexfile')
const appsMocks = require('../../../seeds/mock/apps')
const organisations = require('../../../seeds/mock/organisations')
const users = require('../../../seeds/mock/users')
const { init } = require('../../../src/server/init-server')
const { config } = require('../../../src/server/noauth-config')
const dbInstance = Knex(knexConfig)

describe('v2/apps', () => {
    let server
    let db

    before(async () => {
        config.auth.noAuthUserIdMapping = users[0].id
        db = await dbInstance.transaction()

        server = await init(db, config)
    })

    after(async () => {
        await server.stop()
        await db.rollback()
    })

    const sampleApp = {
        appType: 'APP',
        developer: {
            organisationId: organisations[0].id,
        },
    }
    const dhis2App = appsMocks[0]

    const createFormForApp = app => {
        const form = new FormData()
        form.append('app', JSON.stringify(app))
        return form
    }

    describe('create app', () => {
        it('should create an app', async () => {
            const form = createFormForApp(sampleApp)
            const request = {
                method: 'POST',
                url: '/api/v2/apps',
                headers: form.getHeaders(),
                payload: await streamToPromise(form),
            }

            const res = await server.inject(request)
            expect(res.statusCode).to.equal(201)
            const receivedPayload = JSON.parse(res.payload)
            expect(receivedPayload).to.include(['id'])
            expect(receivedPayload.id).to.be.string()
        })
    })

    describe('get apps', () => {
        it('should get all approved apps', async () => {
            const request = {
                method: 'GET',
                url: '/api/v2/apps',
            }
            const rejectedApp = appsMocks[2]

            const res = await server.inject(request)
            expect(res.statusCode).to.equal(200)

            const apps = res.result.result
            expect(apps).to.be.an.array()
            expect(apps.length).to.be.min(4) // 4 seeds
            expect(apps.find(a => a.id === rejectedApp)).to.be.undefined()
        })

        it('should get apps-only when core=true ', async () => {
            const request = {
                method: 'GET',
                url: '/api/v2/apps?core=true',
            }

            const res = await server.inject(request)
            expect(res.statusCode).to.equal(200)

            const apps = res.result.result
            expect(apps).to.be.an.array()

            const notCore = apps.filter(
                a => a.developer.organisation !== 'DHIS2'
            )

            expect(notCore).to.have.length(0)
        })
    })

    describe('get channels for app', () => {
        it('should only return channels that have versions published', async () => {
            const canaryOnlyApp = appsMocks[5]
            const request = {
                method: 'GET',
                url: `/api/v2/apps/${canaryOnlyApp.id}/channels`,
            }

            const res = await server.inject(request)

            expect(res.statusCode).to.equal(200)
            const result = res.result
            expect(result).to.be.an.array().length(1)
            expect(result[0]).to.be.equal('canary')
        })

        it('should return unique channels', async () => {
            const request = {
                method: 'GET',
                url: `/api/v2/apps/${dhis2App.id}/channels`,
            }

            const res = await server.inject(request)

            expect(res.statusCode).to.equal(200)
            const result = res.result

            expect(result).to.be.an.array().length(3)
            expect(result).to.include('stable')

            const unique = [...new Set(result)]
            expect(unique.length).to.equal(result.length)
        })
    })

    describe('download app', () => {
        const pendingApp = {
            name: 'Pending App app',
            id: '02cb663c-5112-400b-8a93-0353187d337b',
            createdVersionId: null,
        }
        const whoApp = {
            name: 'A nice app by WHO',
            id: '600c70ef-032e-4ea8-bb49-8a3bf7d166eb',
            createdVersionId: null,
        }
        const appsToCreate = [pendingApp, whoApp]

        before(async () => {
            // create a new version to ensure file-exists
            const promises = appsToCreate.map(async app => {
                const form = await createAppVersionForm(app, {
                    version: '1.2.3',
                })
                const req = await server.inject({
                    method: 'POST',
                    url: `/api/v1/apps/${app.id}/versions`,
                    headers: form.getHeaders(),
                    payload: form.getBuffer(),
                })
                app.createdVersionId = req.result.id
                return req
            })

            await Promise.all(promises)
        })

        after(async () => {
            const promises = appsToCreate.map(app => {
                console.log(
                    'deleting app version',
                    app.createdVersionId,
                    app.id,
                    app.name
                )
                return server.inject({
                    method: 'delete',
                    url: `/api/v1/apps/${app.id}/versions/${app.createdVersionId}`,
                })
            })

            const resolved = (await Promise.all(promises)).map(res =>
                expect(res.statusCode).to.equal(200)
            )
        })

        it('should download file successfully', async () => {
            const versionsReq = await server.inject({
                method: 'GET',
                url: `/api/v2/apps/${whoApp.id}/versions`,
            })

            const { result } = versionsReq.result
            expect(result).to.be.an.array()

            const createdVer = result.find(
                v => v.id === whoApp.createdVersionId
            )
            expect(createdVer).to.be.an.object()

            const downloadUrl = createdVer.downloadUrl
            expect(downloadUrl).to.be.a.string()

            const injUrl = downloadUrl.substring(downloadUrl.indexOf('/api'))

            const downloadRes = await server.inject({
                method: 'GET',
                url: injUrl,
            })

            expect(downloadRes.statusCode).to.equal(200)
            const zipBuffer = downloadRes.rawPayload

            expect(zipBuffer).to.be.buffer()
            const zip = new AdmZip(zipBuffer)

            const manifest = zip
                .getEntries()
                .find(e => e.entryName === 'manifest.webapp')
            expect(manifest).to.not.be.undefined()
        })

        describe('unapproved', () => {
            it('should prevent download if user is not logged in', async () => {
                const versionsReq = await server.inject({
                    method: 'GET',
                    url: `/api/v2/apps/${pendingApp.id}/versions`,
                })

                const { result } = versionsReq.result
                expect(result).to.be.an.array()

                const createdVer = result.find(
                    v => v.id === pendingApp.createdVersionId
                )
                expect(createdVer).to.be.an.object()

                const downloadUrl = createdVer.downloadUrl
                expect(downloadUrl).to.be.a.string()

                const injUrl = downloadUrl.substring(
                    downloadUrl.indexOf('/api')
                )

                const downloadRes = await server.inject({
                    method: 'GET',
                    url: injUrl,
                    auth: {
                        strategy: 'no-auth',
                        credentials: {
                            userId: null,
                            roles: [],
                        },
                    },
                })
                expect(downloadRes.statusCode).to.equal(404)
            })

            it('should prevent download if user does not have access to app or is not a manager', async () => {
                const versionsReq = await server.inject({
                    method: 'GET',
                    url: `/api/v2/apps/${pendingApp.id}/versions`,
                })

                const { result } = versionsReq.result
                expect(result).to.be.an.array()

                const createdVer = result.find(
                    v => v.id === pendingApp.createdVersionId
                )
                expect(createdVer).to.be.an.object()

                const downloadUrl = createdVer.downloadUrl
                expect(downloadUrl).to.be.a.string()

                const injUrl = downloadUrl.substring(
                    downloadUrl.indexOf('/api')
                )

                const downloadRes = await server.inject({
                    method: 'GET',
                    url: injUrl,
                    auth: {
                        strategy: 'no-auth',
                        credentials: {
                            // some user that does not exist
                            userId: '2557234e-38d8-4037-9429-80c986632800',
                            roles: [],
                        },
                    },
                })
                expect(downloadRes.statusCode).to.equal(403)
            })

            it('should allow managers to download if unapproved', async () => {
                const versionsReq = await server.inject({
                    method: 'GET',
                    url: `/api/v2/apps/${pendingApp.id}/versions`,
                })

                const { result } = versionsReq.result
                expect(result).to.be.an.array()

                const createdVer = result.find(
                    v => v.id === pendingApp.createdVersionId
                )
                expect(createdVer).to.be.an.object()

                const downloadUrl = createdVer.downloadUrl
                expect(downloadUrl).to.be.a.string()

                const injUrl = downloadUrl.substring(
                    downloadUrl.indexOf('/api')
                )

                const downloadRes = await server.inject({
                    method: 'GET',
                    url: injUrl,
                    auth: {
                        strategy: 'no-auth',
                        credentials: {
                            // some user that does not exist but have role
                            userId: '3557237e-38d8-4037-9429-80c986632800',
                            roles: ['App Hub Manager'], // TODO: Fix circular dependncy and import this
                        },
                    },
                })
                expect(downloadRes.statusCode).to.equal(200)
            })
        })
    })
})
