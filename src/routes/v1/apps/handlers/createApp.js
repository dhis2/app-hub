const debug = require('debug')('appstore:server:routes:handlers:v1:createApp')
const path = require('path')

const Boom = require('@hapi/boom')

const CreateAppModel = require('../../../../models/v1/in/CreateAppModel')
const { AppStatus, ImageType } = require('../../../../enums')

const defaultFailHandler = require('../../defaultFailHandler')
const { saveFile } = require('../../../../utils')

const {
    canCreateApp,
    getCurrentUserFromRequest,
} = require('../../../../security')

const createApp = require('../../../../data/createApp')
const createAppStatus = require('../../../../data/createAppStatus')
const createAppVersion = require('../../../../data/createAppVersion')
const createLocalizedAppVersion = require('../../../../data/createLocalizedAppVersion')
const addAppVersionToChannel = require('../../../../data/addAppVersionToChannel')
const addAppVersionMedia = require('../../../../data/addAppVersionMedia')

const {
    getOrganisationsByName,
    createOrganisation,
    getUserByEmail,
    createUser,
    addUserToOrganisation,
} = require('../../../../data')

module.exports = {
    method: 'POST',
    path: '/v1/apps',
    config: {
        auth: 'token',
        tags: ['api', 'v1'],
        payload: {
            maxBytes: 20 * 1024 * 1024, //20MB
            allow: 'multipart/form-data',
            parse: true,
            output: 'stream',
        },
        validate: {
            payload: CreateAppModel.payloadSchema,
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
        //request.logger.info(`app id: ${request.params.appUuid}`)

        if (!canCreateApp(request, h)) {
            throw Boom.unauthorized()
        }

        const app = request.payload.app
        const appJsonPayload = JSON.parse(app._data.toString('utf8').trim())
        const appJsonValidationResult = CreateAppModel.def.validate(
            appJsonPayload
        )

        if (appJsonValidationResult.error !== undefined) {
            debug(
                'received json did not pass validation: ',
                appJsonValidationResult
            )
            throw Boom.badRequest(appJsonValidationResult.error)
        }

        debug(`Received json:`, appJsonPayload)

        const knex = h.context.db

        const imageFile = request.payload.imageFile
        const file = request.payload.file

        let currentUser = null
        let currentUserId = -1
        try {
            currentUser = await getCurrentUserFromRequest(request, knex)
            currentUserId = currentUser.id
        } catch (err) {
            throw Boom.unauthorized('No user found for the request')
        }
        debug('currentUser:', currentUser)

        //Load the organisation, or create it if it doesnt exist.
        let appUuid = null
        let versionUuid = null
        let iconUUid = null

        const trx = await knex.transaction()

        try {
            let organisation = null
            const organisations = await getOrganisationsByName(
                appJsonPayload.developer.organisation,
                knex
            )
            if (organisations.length === 0) {
                debug('organization not found, proceed to create it')
                //Create organisation
                organisation = await createOrganisation(
                    {
                        userId: currentUserId,
                        name: appJsonPayload.developer.organisation,
                    },
                    knex,
                    trx
                )
            } else {
                organisation = organisations[0]
                if (currentUserId !== organisation.created_by_user_id) {
                    //should we allow anyone to create an app for an existing organisation?
                    //throw Boom.unauthorized()
                }
            }

            //Load developer or create if it doesnt exist
            let appDeveloper = await getUserByEmail(
                appJsonPayload.developer.email,
                knex
            )
            if (appDeveloper === null) {
                //Create developer
                appDeveloper = await createUser(
                    appJsonPayload.developer,
                    knex,
                    trx
                )
                await addUserToOrganisation(
                    {
                        userId: appDeveloper.id,
                        organisationId: organisation.id,
                    },
                    knex,
                    trx
                )
            } else {
                //TODO: Check if developer previously belongs to the organisation or add the dev to the org?
                //TODO: decide business rules for how we should allow someone to be added to an organisation
            }

            const organisationId = organisation.id
            const requestUserId = currentUserId
            const developerUserId = appDeveloper.id

            //Create the basic app
            const dbApp = await createApp(
                {
                    userId: requestUserId,
                    developerUserId,
                    orgId: organisationId,
                    appType: appJsonPayload.appType,
                },
                knex,
                trx
            )

            //Set newly uploaded apps as pending
            appUuid = dbApp.uuid
            await createAppStatus(
                {
                    userId: requestUserId, //the current user set the status
                    orgId: organisationId,
                    appId: dbApp.id,
                    status: AppStatus.PENDING,
                },
                knex,
                trx
            )

            //Create the version of the app
            const { demoUrl, sourceUrl, version } = appJsonPayload.versions[0]
            const appVersion = await createAppVersion(
                {
                    userId: requestUserId,
                    appId: dbApp.id,
                    demoUrl,
                    sourceUrl,
                    version,
                },
                knex,
                trx
            )
            versionUuid = appVersion.uuid

            //Add the texts as english language, only supported for now
            await createLocalizedAppVersion(
                {
                    userId: requestUserId,
                    appVersionId: appVersion.id,
                    description: appJsonPayload.description || '',
                    name: appJsonPayload.name,
                    languageCode: 'en',
                },
                knex,
                trx
            )

            //Publish the app to Stable channel by default
            const {
                minDhisVersion,
                maxDhisVersion,
                channel,
            } = appJsonPayload.versions[0]
            await addAppVersionToChannel(
                {
                    appVersionId: appVersion.id,
                    createdByUserId: currentUserId,
                    channelName: channel,
                    minDhisVersion,
                    maxDhisVersion,
                },
                knex,
                trx
            )

            if (imageFile) {
                debug(
                    'Inserting logo metadata to db and link it to the appVersion'
                )
                if (!appJsonPayload.images || !appJsonPayload.images.length) {
                    throw Boom.badRequest(
                        'Missing metadata about logo imagefile'
                    )
                }

                const imageFileMetadata = imageFile.hapi
                const [imageInfo] = appJsonPayload.images
                let caption, description
                if (imageInfo) {
                    ;({ caption, description } = imageInfo)
                }
                const { id, uuid } = await addAppVersionMedia(
                    {
                        userId: requestUserId,
                        appVersionId: appVersion.id,
                        imageType: ImageType.Logo,
                        fileName: imageFileMetadata.filename,
                        mime: imageFileMetadata.headers['content-type'],
                        caption: caption,
                        description: description,
                    },
                    knex,
                    trx
                )

                debug(`Logo inserted with id '${id}' and uuid '${uuid}'`)
                iconUUid = uuid
            }
        } catch (err) {
            debug('ROLLING BACK TRANSACTION')
            debug(err)

            await trx.rollback()
            throw Boom.badRequest(err.message, err)
        }

        if (appUuid === null || versionUuid === null) {
            await trx.rollback()
            throw Boom.internal('Could not create app')
        }

        try {
            await trx.commit()
            const appUpload = saveFile(
                `${appUuid}/${versionUuid}`,
                'app.zip',
                file._data
            )
            if (imageFile) {
                const iconUpload = saveFile(
                    `${appUuid}/${versionUuid}`,
                    iconUUid,
                    imageFile._data
                )
                await Promise.all([appUpload, iconUpload])
            } else {
                await appUpload
            }
        } catch (ex) {
            debug(ex)
            await trx.rollback()
            throw Boom.internal(ex)
        }

        return {
            statusCode: 200,
            uuid: appUuid,
        }
    },
}
