const debug = require('debug')('apphub:server:routes:handlers:v1:createApp')

const Boom = require('@hapi/boom')

const CreateAppModel = require('../../../../models/v1/in/CreateAppModel')
const { AppStatus, MediaType } = require('../../../../enums')

const defaultFailHandler = require('../../defaultFailHandler')
const { saveFile } = require('../../../../utils')

const {
    canCreateApp,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const {
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
} = require('../../../../data')

const OrganisationService = require('../../../../services/organisation')

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

        const app = request.payload.app
        const appJsonPayload = JSON.parse(app)
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
        let isManager = false
        try {
            currentUser = await getCurrentUserFromRequest(request, knex)
            currentUserId = currentUser.id

            isManager = currentUserIsManager(request)
        } catch (err) {
            throw Boom.unauthorized('No user found for the request')
        }
        debug('currentUser:', currentUser)

        //Load the organisation, or create it if it doesnt exist.
        let appId = null
        let versionId = null
        let iconId = null

        const trx = await knex.transaction()

        try {
            let organisation = null
            const organisations = await getOrganisationsByName(
                appJsonPayload.developer.organisation,
                trx
            )
            if (organisations.length === 0) {
                debug('organization not found, proceed to create it')
                //Create organisation
                organisation = await createOrganisation(
                    {
                        userId: currentUserId,
                        name: appJsonPayload.developer.organisation,
                    },
                    trx
                )
                await addUserToOrganisation(
                    {
                        userId: currentUserId,
                        organisationId: organisation.id,
                    },
                    trx
                )
            } else {
                organisation = organisations[0]

                const isMember = await OrganisationService.hasUser(
                    organisation.id,
                    currentUserId,
                    trx
                )

                if (!isMember && !isManager) {
                    throw Boom.unauthorized(
                        'You dont have permission to upload apps to that organisation'
                    )
                }
            }

            //Load developer or create if it doesnt exist
            let appDeveloper = await getUserByEmail(
                appJsonPayload.developer.email,
                knex
            )
            if (appDeveloper === null) {
                //Create developer
                appDeveloper = await createUser(appJsonPayload.developer, trx)
                await addUserToOrganisation(
                    {
                        userId: appDeveloper.id,
                        organisationId: organisation.id,
                    },
                    trx
                )
            } else {
                //TODO: Check if developer previously belongs to the organisation or add the dev to the org?
                //TODO: decide business rules for how we should allow someone to be added to an organisation
            }

            const organisationId = organisation.id
            const requestUserId = currentUserId
            const developerUserId = appDeveloper.id

            if (appJsonPayload.owner) {
                const { email, name } = appJsonPayload.owner
                let appOwner = await getUserByEmail(email, trx)

                //Only automatically add the user to the organisation if,
                //1. either it's a manager uploading the app
                //2. or the owner e-mail is the same as verified on the request
                const shouldAddUserToOrg =
                    isManager || email === currentUser.email

                debug('shouldAddUserToOrg:', shouldAddUserToOrg)
                debug('isManager:', isManager)
                debug('owner email:', email)
                debug('currentUser.email', currentUser.email)

                if (shouldAddUserToOrg && appOwner === null) {
                    appOwner = await createUser(
                        {
                            email,
                            name,
                        },
                        trx
                    )
                    await addUserToOrganisation(
                        {
                            userId: appOwner.id,
                            organisationId: organisation.id,
                        },
                        trx
                    )
                } else if (shouldAddUserToOrg) {
                    const hasUser = await OrganisationService.hasUser(
                        organisation.id,
                        appOwner.id,
                        trx
                    )
                    if (!hasUser) {
                        await addUserToOrganisation(
                            {
                                userId: appOwner.id,
                                organisationId: organisation.id,
                            },
                            trx
                        )
                    }
                }
            }

            //Create the basic app
            const dbApp = await createApp(
                {
                    userId: requestUserId,
                    developerUserId,
                    orgId: organisationId,
                    appType: appJsonPayload.appType,
                },
                trx
            )

            //Set newly uploaded apps as pending
            appId = dbApp.id
            await createAppStatus(
                {
                    userId: requestUserId, //the current user set the status
                    orgId: organisationId,
                    appId: dbApp.id,
                    status: AppStatus.PENDING,
                },
                trx
            )

            //Create the version of the app
            const { demoUrl, version } = appJsonPayload.versions[0]
            const { sourceUrl } = appJsonPayload
            const appVersion = await createAppVersion(
                {
                    userId: requestUserId,
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
                    userId: requestUserId,
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
            } = appJsonPayload.versions[0]
            await addAppVersionToChannel(
                {
                    appVersionId: appVersion.id,
                    createdByUserId: currentUserId,
                    channelName: channel,
                    minDhisVersion,
                    maxDhisVersion,
                },
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
                const { id: appMedia_id, media_id } = await addAppMedia(
                    {
                        userId: requestUserId,
                        appId: appId,
                        mediaType: MediaType.Logo,
                        fileName: imageFileMetadata.filename,
                        mime: imageFileMetadata.headers['content-type'],
                        caption: caption,
                        description: description,
                    },
                    trx
                )

                debug(
                    `Logo inserted with app_media_id '${appMedia_id}' and media_id: '${media_id}`
                )
                iconId = appMedia_id
            }
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
            if (imageFile) {
                const iconUpload = saveFile(appId, iconId, imageFile._data)
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
            uuid: appId,
        }
    },
}
