const debug = require('debug')(
    'appstore:server:routes:handlers:v1:createAppVersion'
)
const path = require('path')

const Boom = require('boom')

const CreateAppVersionModel = require('../../../../models/v1/in/CreateAppVersionModel')

const defaultFailHandler = require('../../defaultFailHandler')
const { saveFile } = require('../../../../utils')

const {
    canCreateApp,
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const createAppVersion = require('../../../../data/createAppVersion')
const createLocalizedAppVersion = require('../../../../data/createLocalizedAppVersion')
const addAppVersionToChannel = require('../../../../data/addAppVersionToChannel')

const { getAppDeveloperId, getAppsByUuid } = require('../../../../data')

const { convertAppToV1AppVersion } = require('../formatting')

module.exports = {
    method: 'POST',
    path: '/v1/apps/{appUuid}/versions',
    config: {
        auth: getCurrentAuthStrategy(),
        tags: ['api', 'v1'],
        payload: {
            maxBytes: 20 * 1024 * 1024, //20MB
            allow: 'multipart/form-data',
            parse: true,
            output: 'stream',
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
        const appVersionJson = JSON.parse(
            versionPayload._data.toString('utf8').trim()
        )
        const validationResult = CreateAppVersionModel.def.validate(
            appVersionJson
        )
        const file = request.payload.file

        if (validationResult.error !== null) {
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
        const { appUuid } = request.params

        //TODO: make langCode dynamic, legacy v1 endpoint supports english only
        const languageCode = 'en'

        const apps = getAppsByUuid(appUuid, languageCode, db)
        if (!apps || apps.length === 0) {
            throw Boom.badRequest('An app with that uuid does not exist')
        }

        const appDeveloperId = await getAppDeveloperId(appUuid, db)

        //check permissions and update if we're owner of the app or a manager
        const currentUser = await getCurrentUserFromRequest(request, db)
        const currentUserId = currentUser.id

        let versionUuid = null

        if (currentUserIsManager(request) || currentUserId === appDeveloperId) {
            const transaction = await db.transaction()

            const {
                demoUrl,
                sourceUrl,
                version,
                minDhisVersion,
                maxDhisVersion,
            } = appVersionJson

            const [dbApp] = await getAppsByUuid(appUuid, languageCode, db)
            debug(`Adding version to app ${JSON.stringify(dbApp)}`)

            //TODO: check if the version already exist, or handle duplicate constraint errors from db
            const appVersion = await createAppVersion(
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
            versionUuid = appVersion.uuid

            //Add the texts as english language, only supported for now
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

            await addAppVersionToChannel(
                {
                    appVersionId: appVersion.id,
                    createdByUserId: currentUserId,
                    channelName: 'Stable',
                    minDhisVersion,
                    maxDhisVersion,
                },
                db,
                transaction
            )

            await transaction.commit()

            await saveFile(`${appUuid}/${versionUuid}`, 'app.zip', file._data)
        } else {
            throw Boom.unauthorized()
        }

        const dbAppRows = await getAppsByUuid(appUuid, languageCode, db)
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
