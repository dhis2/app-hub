const debug = require('debug')(
    'apphub:server:routes:handlers:v1:createAppVersion'
)

const Boom = require('@hapi/boom')

const CreateAppVersionModel = require('../../../../models/v1/in/CreateAppVersionModel')

const defaultFailHandler = require('../../defaultFailHandler')
const { saveFile } = require('../../../../utils')

const {
    getCurrentUserFromRequest,
    currentUserIsManager,
    verifyBundle,
} = require('../../../../security')

const parseAppDetails = require('../../../../utils/parseAppDetails')
const createAppVersion = require('../../../../data/createAppVersion')
const createLocalizedAppVersion = require('../../../../data/createLocalizedAppVersion')
const addAppVersionToChannel = require('../../../../data/addAppVersionToChannel')

const Organisation = require('../../../../services/organisation')
const {
    getOrganisationAppsByUserId,
    getAppsById,
    patchApp,
} = require('../../../../data')

const { convertAppToV1AppVersion } = require('../formatting')

module.exports = {
    method: 'POST',
    path: '/v1/apps/{appId}/versions',
    config: {
        auth: {
            strategies: ['token', 'api-key'],
        },
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

        const db = h.context.db
        const { appId } = request.params

        //check permissions and update if we're owner of the app or a manager
        const currentUser = await getCurrentUserFromRequest(request, db)
        const currentUserId = currentUser.id

        const isManager = currentUserIsManager(request)
        const userApps = await getOrganisationAppsByUserId(currentUserId, db)
        const userCanEditApp =
            isManager || userApps.map((app) => app.app_id).indexOf(appId) !== -1

        if (!userCanEditApp) {
            throw Boom.forbidden()
        }

        const versionPayload = request.payload.version

        let appVersionJson
        try {
            appVersionJson = JSON.parse(versionPayload)
        } catch (e) {
            throw Boom.badRequest(e)
        }

        const validationResult =
            CreateAppVersionModel.def.validate(appVersionJson)
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

        //TODO: make langCode dynamic? legacy v1 endpoint supports english only
        const languageCode = 'en'

        let dbAppRows = await getAppsById(appId, languageCode, db)
        if (!dbAppRows || dbAppRows.length === 0) {
            throw Boom.badRequest('An app with that id does not exist')
        }

        //check if that version already exists on this app
        const existingAppVersions = dbAppRows.filter(
            (row) => row.version === appVersionJson.version
        )
        if (existingAppVersions.length > 0) {
            throw Boom.badRequest(
                'An appversion with that identifier already exists'
            )
        }

        let versionId = null

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

        // Todo: FIXME a workround - seems like the source url is at app version level but it doesn't get saved after the very first time
        const appSourceUrl = dbAppRows?.find((a) => !!a.source_url)?.source_url

        debug(`Adding version to app ${dbApp.name}`)
        let appVersion = null

        const { changelog, d2config } = await parseAppDetails({
            buffer: file._data,
            appRepo: appSourceUrl,
        })

        try {
            appVersion = await createAppVersion(
                {
                    userId: currentUserId,
                    appId: dbApp.app_id,
                    demoUrl,
                    sourceUrl,
                    version,
                    d2config: JSON.stringify(d2config),
                },
                transaction
            )
            versionId = appVersion.id
        } catch (err) {
            await transaction.rollback()
            throw Boom.boomify(err)
        }

        try {
            await patchApp(
                {
                    id: dbApp.app_id,
                    changelog,
                },
                db,
                transaction
            )
        } catch (_) {
            // ignore if we can not update the changelog at the app level
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
                transaction
            )
        } catch (err) {
            await transaction.rollback()
            throw Boom.boomify(err)
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
                transaction
            )
        } catch (err) {
            await transaction.rollback()
            throw Boom.boomify(err)
        }

        try {
            const organisationSlug = dbApp.organisation_slug
            const organisation = await Organisation.findOneBySlug(
                organisationSlug,
                false,
                transaction
            )
            verifyBundle({
                buffer: file._data,
                appId,
                appName: dbApp.name,
                version,
                organisationName: organisation.name,
            })
        } catch (err) {
            await transaction.rollback()
            throw Boom.badRequest(err)
        }

        try {
            await saveFile(`${appId}/${versionId}`, 'app.zip', file._data)
        } catch (err) {
            await transaction.rollback()
            throw Boom.boomify(err)
        }

        await transaction.commit()

        //fetch the new version rows and filter out the one we've just created data for
        dbAppRows = await getAppsById(appId, languageCode, db)
        const [appWithVersion] = dbAppRows.filter(
            (app) => app.version === appVersionJson.version
        )

        const serverUrl = `${request.server.info.protocol}://${request.info.host}/api`
        const appVersionLegacyFormat = convertAppToV1AppVersion(
            appWithVersion,
            serverUrl
        )

        return appVersionLegacyFormat
    },
}
