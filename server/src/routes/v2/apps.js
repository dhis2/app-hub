const Boom = require('@hapi/boom')
const debug = require('debug')('apphub:server:routes:handlers:apps')
const OrganisationService = require('../../services/organisation')
const AppModel = require('../../models/v1/out/App')
const CreateAppModel = require('../../models/v2/in/CreateAppModel')
const { AppStatus, MediaType } = require('../../enums')
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
const { convertAppsToApiV1Format } = require('../v1/apps/formatting')
const { saveFile } = require('../../utils')
const { filterAppsBySpecificDhis2Version } = require('../../utils/filters')
const Joi = require('../../utils/CustomJoi')
const {
    canCreateApp,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../security')

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
                    ).description(
                        'Filter by channel'
                    ).default(['stable']),
                    types: Joi.filter(
                        Joi.stringArray().items(Joi.valid(...APPTYPES))
                    ).description(
                        'Filter by app type'
                    ).default(['APP']),
                }).unknown(true),
            },
            plugins: {
                queryFilter: {
                    enabled: true
                },
                pagination: {
                    enabled: true,
                },
            },
        },
        handler: async (request, h) => {
            const channels = request.plugins.queryFilter.getFilter('channels').value
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
                total: result.length
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

            const { app, logo, file } = request.payload

            if (!app || !logo || !file) {
                throw Boom.badRequest('App, logo and zip file are all required')
            }

            const appJsonPayload = JSON.parse(app)
            const appJsonValidationResult = CreateAppModel.def.validate(
                appJsonPayload
            )

            if (appJsonValidationResult.error) {
                throw Boom.badRequest(appJsonValidationResult.error)
            }

            const knex = h.context.db

            let currentUser = null
            let currentUserId = null
            let isManager = false
            try {
                currentUser = await getCurrentUserFromRequest(request, knex)
                currentUserId = currentUser.id

                isManager = currentUserIsManager(request)
            } catch (err) {
                throw Boom.unauthorized('No user found for the request')
            }

            let appId = null
            let versionId = null
            let iconId = null

            const trx = await knex.transaction()

            try {
                const { organisationId } = appJsonPayload.developer
                const organisation = await OrganisationService.findOne(
                    organisationId,
                    false,
                    trx
                )

                if (!organisation) {
                    throw Boom.badRequest('Unknown organisation')
                }
                const isMember = await OrganisationService.hasUser(
                    organisationId,
                    currentUserId,
                    trx
                )
                if (!isMember && !isManager) {
                    throw Boom.unauthorized(
                        'You don\'t have permission to upload apps to that organisation'
                    )
                }

                //Create the basic app
                const dbApp = await createApp(
                    {
                        userId: currentUserId,
                        developerUserId: currentUserId,
                        orgId: organisationId,
                        appType: appJsonPayload.appType,
                    },
                    trx
                )

                //Set newly uploaded apps as pending
                appId = dbApp.id
                await createAppStatus(
                    {
                        userId: currentUserId,
                        orgId: organisationId,
                        appId: dbApp.id,
                        status: AppStatus.PENDING,
                    },
                    trx
                )

                //Create the version of the app
                const { demoUrl, version } = appJsonPayload.version
                const { sourceUrl } = appJsonPayload
                const appVersion = await createAppVersion(
                    {
                        userId: currentUserId,
                        appId: dbApp.id,
                        demoUrl,
                        sourceUrl,
                        version,
                    },
                    trx
                )
                versionId = appVersion.id

                //Add the texts as english language, only supported for now
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

                //Publish the app to stable channel by default
                const {
                    minDhisVersion,
                    maxDhisVersion,
                    channel,
                } = appJsonPayload.version
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

                const logoMetadata = logo.hapi
                const { id: appMedia_id, media_id } = await addAppMedia(
                    {
                        userId: currentUserId,
                        appId: appId,
                        mediaType: MediaType.Logo,
                        fileName: logoMetadata.filename,
                        mime: logoMetadata.headers['content-type'],
                        caption: 'App logo',
                        description: '',
                    },
                    trx
                )

                debug(
                    `Logo inserted with app_media_id '${appMedia_id}' and media_id: '${media_id}`
                )
                iconId = appMedia_id
            } catch (err) {
                debug('ROLLING BACK TRANSACTION')
                debug(err)

                await trx.rollback()
                throw Boom.badRequest(err.message, err)
            }

            if (appId === null || versionId === null) {
                await trx.rollback()
                throw Boom.internal('Could not create app')
            }

            try {
                await trx.commit()
                const appUpload = saveFile(
                    `${appId}/${versionId}`,
                    'app.zip',
                    file._data
                )
                const iconUpload = saveFile(appId, iconId, logo._data)
                await Promise.all([appUpload, iconUpload])
            } catch (ex) {
                debug(ex)
                await trx.rollback()
                throw Boom.internal(ex)
            }

            return {
                statusCode: 200,
                appId
            }
        },
    }
]
