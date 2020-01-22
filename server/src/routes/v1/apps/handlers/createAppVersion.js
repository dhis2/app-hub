const debug = require('debug')(
    'apphub:server:routes:handlers:v1:createAppVersion'
)
const path = require('path')

const Boom = require('@hapi/boom')

const CreateAppVersionModel = require('../../../../models/v1/in/CreateAppVersionModel')

const defaultFailHandler = require('../../defaultFailHandler')
const { saveFile } = require('../../../../utils')

const {
    canCreateApp,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const createAppVersion = require('../../../../data/createAppVersion')
const createLocalizedAppVersion = require('../../../../data/createLocalizedAppVersion')
const addAppVersionToChannel = require('../../../../data/addAppVersionToChannel')

const { getAppDeveloperId, getAppsById } = require('../../../../data')

const { convertAppToV1AppVersion } = require('../formatting')

module.exports = {
    method: 'POST',
    path: '/v1/apps/{appId}/versions',
    config: {
        auth: 'token',
        tags: ['api', 'v1'],
        payload: {
            maxBytes: 20 * 1024 * 1024, //20MB
            allow: 'multipart/form-data',
            parse: true,
            output: 'stream',
            multipart: true,
        },
        validate: {
            payload: CreateAppVersionModel.payloadSchema,
            failAction: defaultFailHandler,
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            },
        },
        response: {
            status: {
                //200: CreateAppModel.def,
                //400: Joi.any(),
                //500: Joi.string()
            },
            failAction: defaultFailHandler,
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        if (!canCreateApp(request, h)) {
            throw Boom.unauthorized()
        }

        //debug("payload:", request.payload)
        const versionPayload = request.payload.version
        const appVersionJson = JSON.parse(versionPayload)
        const validationResult = CreateAppVersionModel.def.validate(
            appVersionJson
        )
        const file = request.payload.file

        if (validationResult.error !== undefined) {
            debug('Version did not pass validation: ', validationResult.error)
            throw Boom.badRequest(validationResult.error)
        }
        if (!file) {
            debug('No file attached to request')
            throw Boom.badRequest(`No file attached to request`)
        }

        //we have passed all input validation, lets move on
        debug(`Received version:\n ${JSON.stringify(appVersionJson, null, 2)}`)

        const db = h.context.db
        const { appId } = request.params

        //TODO: make langCode dynamic? legacy v1 endpoint supports english only
        const languageCode = 'en'

        let dbAppRows = await getAppsById(appId, languageCode, db)
        if (!dbAppRows || dbAppRows.length === 0) {
            throw Boom.badRequest('An app with that id does not exist')
        }

        //check if that version already exists on this app
        const existingAppVersions = dbAppRows.filter(
            row => row.version === appVersionJson.version
        )
        if (existingAppVersions.length > 0) {
            throw Boom.badRequest(
                'An appversion with that identifier already exists'
            )
        }

        const appDeveloperId = await getAppDeveloperId(appId, db)

        //check permissions and update if we're owner of the app or a manager
        const currentUser = await getCurrentUserFromRequest(request, db)
        const currentUserId = currentUser.id

        let versionId = null

        if (currentUserIsManager(request) || currentUserId === appDeveloperId) {
            const transaction = await db.transaction()

            const {
                demoUrl,
                sourceUrl,
                version,
                minDhisVersion,
                maxDhisVersion,
                channel,
            } = appVersionJson

            const [dbApp] = dbAppRows
            debug(`Adding version to app ${dbApp.name}`)
            let appVersion = null

            try {
                appVersion = await createAppVersion(
                    {
                        userId: currentUserId,
                        appId: dbApp.app_id,
                        demoUrl,
                        sourceUrl,
                        version,
                    },
                    db,
                    transaction
                )
                versionId = appVersion.id
            } catch (err) {
                await transaction.rollback()
                throw Boom.internal('Could not create app version', err)
            }

            //Add the texts as english language, only supported for now
            try {
                await createLocalizedAppVersion(
                    {
                        userId: currentUserId,
                        appVersionId: appVersion.id,
                        description: dbApp.description || '',
                        name: dbApp.name,
                        languageCode: languageCode,
                    },
                    db,
                    transaction
                )
            } catch (err) {
                await transaction.rollback()
                throw Boom.internal('Could not save localized appversion', err)
            }

            try {
                await addAppVersionToChannel(
                    {
                        appVersionId: appVersion.id,
                        createdByUserId: currentUserId,
                        channelName: channel,
                        minDhisVersion,
                        maxDhisVersion,
                    },
                    db,
                    transaction
                )
            } catch (err) {
                await transaction.rollback()
                throw Boom.internal(
                    `Could not publish appversion to channel ${channel}`,
                    err
                )
            }

            try {
                await saveFile(`${appId}/${versionId}`, 'app.zip', file._data)
            } catch (err) {
                await transaction.rollback()
                throw Boom.internal(`Could not save app file to storage`, err)
            }

            await transaction.commit()
        } else {
            throw Boom.unauthorized()
        }

        //fetch the new version rows and filter out the one we've just created data for
        dbAppRows = await getAppsById(appId, languageCode, db)
        const [appWithVersion] = dbAppRows.filter(
            app => app.version === appVersionJson.version
        )

        const serverUrl = `${request.server.info.protocol}://${request.info.host}/api`
        const appVersionLegacyFormat = convertAppToV1AppVersion(
            appWithVersion,
            serverUrl
        )

        return appVersionLegacyFormat
    },
}
