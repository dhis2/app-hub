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
const Joi = require('../../utils/CustomJoi')
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
                throw Boom.unauthorized()
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
                throw Boom.unauthorized(
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
            const channels = appVersionService.getAvailableChannels(appId, db)

            return channels
        },
    },
]
