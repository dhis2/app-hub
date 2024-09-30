const Boom = require('@hapi/boom')
const { getApps } = require('../../data')
const { AppStatus } = require('../../enums')
const CreateAppModel = require('../../models/v2/in/CreateAppModel')
const {
    canCreateApp,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../security')
const App = require('../../services/app')
const Organisation = require('../../services/organisation')
const { getFile } = require('../../utils')
const Joi = require('../../utils/CustomJoi')
const { Filters } = require('../../utils/Filter')
const { filterAppsBySpecificDhis2Version } = require('../../utils/filters')
const { convertAppsToApiV1Format } = require('../v1/apps/formatting')
const CHANNELS = ['stable', 'development', 'canary']
const APPTYPES = ['APP', 'DASHBOARD_WIDGET', 'TRACKER_DASHBOARD_WIDGET']

module.exports = [
    {
        method: 'GET',
        path: '/v2/apps',
        config: {
            auth: false,
            tags: ['api', 'v2'],
            validate: {
                query: Joi.object({
                    channels: Joi.filter(
                        Joi.stringArray().items(Joi.valid(...CHANNELS))
                    )
                        .description('Filter by channel')
                        .default(['stable']),
                    core: Joi.filter(Joi.boolean()).description(
                        'Filter by core app'
                    ),
                    types: Joi.filter(
                        Joi.stringArray().items(Joi.valid(...APPTYPES))
                    )
                        .description('Filter by app type')
                        .default(['APP']),
                }).unknown(true),
            },
            plugins: {
                queryFilter: {
                    enabled: true,
                },
                pagination: {
                    enabled: true,
                },
            },
        },
        handler: async (request, h) => {
            const queryFilter = request.plugins.queryFilter
            const channels = queryFilter.getFilter('channels').value
            const types = queryFilter.getFilter('types').value
            const coreAppFilter = queryFilter.getFilter('core')

            const apps = await getApps(
                {
                    status: AppStatus.APPROVED,
                    languageCode: 'en',
                    channels,
                    types,
                    query: request.query.query,
                    coreApp: coreAppFilter && coreAppFilter.value,
                },
                h.context.db
            )
            const filteredApps = filterAppsBySpecificDhis2Version(
                apps,
                request.query.dhis_version
            )

            const pager = request.plugins.pagination
            const result = convertAppsToApiV1Format(filteredApps, request)
            return h.paginate(pager, {
                result,
                total: result.length,
            })
        },
    },
    {
        method: 'POST',
        path: '/v2/apps',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
            payload: {
                maxBytes: 20 * 1024 * 1024, //20MB
                allow: 'multipart/form-data',
                parse: true,
                output: 'stream',
                multipart: true,
            },
            validate: {
                payload: CreateAppModel.payloadSchema,
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                },
            },
        },
        handler: async (request, h) => {
            if (!canCreateApp(request, h)) {
                throw Boom.forbidden()
            }

            const { db } = h.context
            const { id: currentUserId } = await getCurrentUserFromRequest(
                request,
                db
            )
            const isManager = currentUserIsManager(request)

            const { payload } = request
            const appJsonPayload = JSON.parse(payload.app)
            const appJsonValidationResult =
                CreateAppModel.def.validate(appJsonPayload)

            if (appJsonValidationResult.error) {
                throw Boom.badRequest(appJsonValidationResult.error)
            }

            const { organisationId } = appJsonPayload.developer
            const organisation = await Organisation.findOne(
                organisationId,
                false,
                db
            )
            if (!organisation) {
                throw Boom.badRequest('Unknown organisation')
            }

            const isMember = await Organisation.hasUser(
                organisationId,
                currentUserId,
                db
            )
            if (!isMember && !isManager) {
                throw Boom.forbidden(
                    `You don't have permission to upload apps to that organisation`
                )
            }

            const { appType } = appJsonPayload
            const app = await db.transaction(trx =>
                App.create(
                    {
                        userId: currentUserId,
                        organisationId,
                        appType,
                        status: AppStatus.PENDING,
                    },
                    trx
                )
            )

            return h.response(app).created(`/v2/apps/${app.id}`)
        },
    },
    {
        method: 'GET',
        path: '/v2/apps/{appId}/channels',
        config: {
            auth: false,
            tags: ['api', 'v2'],
            validate: {
                params: Joi.object({
                    appId: Joi.string().required(),
                }),
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { appVersionService } = request.services(true)

            const { appId } = request.params

            return appVersionService.getAvailableChannels(appId, db)
        },
    },
    {
        method: 'GET',
        path: '/v2/apps/{appId}/download/{appSlug}_{version}.zip',
        config: {
            auth: { strategy: 'token', mode: 'try' },
            tags: ['api', 'v2'],
            validate: {
                params: Joi.object({
                    appId: Joi.string().required(),
                    appSlug: Joi.string().required(),
                    version: Joi.string().required(),
                }),
            },
            plugins: {
                queryFilter: {
                    enabled: true,
                },
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { appVersionService } = request.services(true)

            const { appId, appSlug, version } = request.params
            const user = request.getUser()

            const filterObject = {
                slug: appSlug,
                version: version,
            }

            if (!user) {
                // only approved apps should be downloadable if not logged in
                filterObject.status = 'APPROVED'
            } else {
                const canEditApp =
                    currentUserIsManager(request) ||
                    (await App.canEditApp(user.id, appId, db))

                if (!canEditApp) {
                    return Boom.forbidden()
                }
            }

            const appVersionFilter =
                Filters.createFromQueryFilters(filterObject)

            const { result } = await appVersionService.findByAppId(
                appId,
                { filters: appVersionFilter },
                db
            )

            if (result.length < 1) {
                throw Boom.notFound()
            }

            const [appVersion] = result

            const file = await getFile(
                `${appVersion.appId}/${appVersion.id}`,
                'app.zip'
            )

            request.log(
                'getFile',
                `Fetching file for ${appVersion.appId} / ${appVersion.id}`
            )

            appVersionService
                .incrementDownloadCount(appVersion.id, db)
                .catch(e =>
                    request.logger.error('Failed to increment download', e)
                )

            return h
                .response(file.Body)
                .type('application/zip')
                .header(
                    'Content-Disposition',
                    `attachment; filename=${appVersion.slug}_${appVersion.version}.zip;`
                )
                .header('Content-length', file.ContentLength)
        },
    },
]
