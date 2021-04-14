const Boom = require('@hapi/boom')
const debug = require('debug')('apphub:server:routes:handlers:apps')
const {
    getApps,
    createApp,
    createAppStatus,
    createAppVersion,
    createLocalizedAppVersion,
    addAppVersionToChannel,
    addAppMedia,
    getOrganisationsByName,
    createOrganisation,
    getUserByEmail,
    createUser,
    addUserToOrganisation,
} = require('../../data')
const { AppStatus, MediaType } = require('../../enums')
const AppModel = require('../../models/v1/out/App')
const CreateAppModel = require('../../models/v2/in/CreateAppModel')
const {
    canCreateApp,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../security')
const OrganisationService = require('../../services/organisation')
const { saveFile } = require('../../utils')
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
            const channels = request.plugins.queryFilter.getFilter('channels')
                .value
            const types = request.plugins.queryFilter.getFilter('types').value

            const apps = await getApps(
                {
                    status: AppStatus.APPROVED,
                    languageCode: 'en',
                    channels,
                    types,
                    query: request.query.query,
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
            const appJsonValidationResult = CreateAppModel.def.validate(
                appJsonPayload
            )

            if (appJsonValidationResult.error) {
                throw Boom.badRequest(appJsonValidationResult.error)
            }

            const { organisationId } = appJsonPayload.developer
            const organisation = await OrganisationService.findOne(
                organisationId,
                false,
                db
            )
            if (!organisation) {
                throw Boom.badRequest('Unknown organisation')
            }

            const isMember = await OrganisationService.hasUser(
                organisationId,
                currentUserId,
                db
            )
            if (!isMember && !isManager) {
                throw Boom.unauthorized(
                    `You don't have permission to upload apps to that organisation`
                )
            }

            // TODO: Move function to apps service
            const createAppWithLogo = async trx => {
                const { appType, sourceUrl, version } = appJsonPayload

                // TODO: Move function to apps service
                const app = await createApp(
                    {
                        userId: currentUserId,
                        developerUserId: currentUserId,
                        orgId: organisationId,
                        appType: appType,
                    },
                    trx
                )

                // TODO: Move function to apps service
                // TODO: The status of an app should default to PENDING upon
                // creation, so should edit `createApp` so that this function
                // is not necessary
                await createAppStatus(
                    {
                        userId: currentUserId,
                        orgId: organisationId,
                        appId: app.id,
                        status: AppStatus.PENDING,
                    },
                    trx
                )

                // TODO: Move function to apps service
                const appVersion = await createAppVersion(
                    {
                        userId: currentUserId,
                        appId: app.id,
                        sourceUrl,
                        demoUrl: version.demoUrl,
                        version: version.version,
                    },
                    trx
                )

                // Store the app name and description in the English localised
                // version, which is the only language currently supported
                await createLocalizedAppVersion(
                    {
                        userId: currentUserId,
                        appVersionId: appVersion.id,
                        description: appJsonPayload.description || '',
                        name: appJsonPayload.name,
                        languageCode: 'en',
                    },
                    trx
                )

                const { minDhisVersion, maxDhisVersion, channel } = version
                await addAppVersionToChannel(
                    {
                        appVersionId: appVersion.id,
                        createdByUserId: currentUserId,
                        channelName: channel,
                        minDhisVersion,
                        maxDhisVersion: maxDhisVersion || '',
                    },
                    trx
                )

                const { logo } = payload
                const logoMetadata = logo.hapi
                // TODO: Move function to apps service
                const { id: logoId } = await addAppMedia(
                    {
                        userId: currentUserId,
                        appId: app.id,
                        mediaType: MediaType.Logo,
                        fileName: logoMetadata.filename,
                        mime: logoMetadata.headers['content-type'],
                        caption: 'App logo',
                        description: '',
                    },
                    trx
                )

                const { file } = payload
                const appUpload = saveFile(
                    `${app.id}/${appVersion.id}`,
                    'app.zip',
                    file._data
                )
                const logoUpload = saveFile(app.id, logoId, logo._data)
                await Promise.all([appUpload, logoUpload])

                return app
            }

            const app = await db.transaction(createAppWithLogo)

            return h.response(app).created(`/v2/apps/${app.id}`)
        },
    },
]
