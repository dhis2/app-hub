const path = require('path')

const Boom = require('boom')

const CreateAppModel = require('@models/v1/in/CreateAppModel')
const { AppStatus, ImageType } = require('@enums')

const defaultFailHandler = require('../../defaultFailHandler')
const { saveFile } = require('@utils')

const { canCreateApp } = require('@security')

const createAppAsync = require('@data/createAppAsync')
const createAppStatusAsync = require('@data/createAppStatusAsync')
const createAppVersionAsync = require('@data/createAppVersionAsync')
const createLocalizedAppVersionAsync = require('@data/createLocalizedAppVersionAsync')
const addAppVersionToChannelAsync = require('@data/addAppVersionToChannelAsync')
const addAppVersionMediaAsync = require('@data/addAppVersionMediaAsync')

const { getCurrentUserFromRequest } = require('@utils')

const {
    getOrganisationsByNameAsync,
    createOrganisationAsync,
    getUserByEmailAsync,
    createUserAsync,
    addUserToOrganisationAsync,
    createTransaction
} = require('@data')

module.exports = {
    method: 'POST',
    path: '/v1/apps',
    config: {
        auth: 'jwt',
        tags: ['api', 'v1'],
        payload: {
            maxBytes: 20 * 1024 * 1024, //20MB
            allow: 'multipart/form-data',
            parse: true,
            output: 'stream'
        },
        validate: {
            payload: CreateAppModel.payloadSchema,
            failAction: defaultFailHandler
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },
        response: {
            status: {
                //200: CreateAppModel.def,
                //400: Joi.any(),
                //500: Joi.string()
            },
            failAction: defaultFailHandler
        }
    },
    handler: async (request, h) => {

        request.logger.info('In handler %s', request.path)
        //request.logger.info(`app id: ${request.params.appUuid}`)

        if ( !canCreateApp(request, h) ) {
            throw Boom.unauthorized()
        }

        const app = request.payload.app
        const appJsonPayload = JSON.parse(app._data.toString('utf8').trim())
        const appJsonValidationResult = CreateAppModel.def.validate(appJsonPayload)

        if ( appJsonValidationResult.error !== null ) {
            throw Boom.badRequest(appJsonValidationResult.error)
        }

        request.logger.info(`Received json: ${appJsonPayload}`)

        const knex = h.context.db

        const imageFile = request.payload.imageFile
        const file = request.payload.file
        

        const currentUser = getCurrentUserFromRequest(request, knex);
        const currentUserId = currentUser.id

        //Load the organisation, or create it if it doesnt exist.
        let appUuid = null
        let versionUuid = null
        let iconUUid = null


        const trx = await createTransaction(knex)

        try {
            let organisation = null
            const organisations = await getOrganisationsByNameAsync(appJsonPayload.developer.organisation, knex)
            if ( organisations.length === 0 ) {
                //Create organisation
                organisation = await createOrganisationAsync({
                    userId: currentUserId,
                    name: appJsonPayload.developer.organisation
                }, knex, trx)

            } else {
                //TODO: what if multiple orgs is found?
                organisation = organisations[0]
            }
            
    
            //Load developer or create if it doesnt exist
            let appDeveloper = await getUserByEmailAsync(appJsonPayload.developer.email, knex)
            if ( appDeveloper === null ) {
                //Create developer
                appDeveloper = await createUserAsync(appJsonPayload.developer, knex, trx)
                await addUserToOrganisationAsync({ 
                    userId: appDeveloper.id, 
                    organisationId: organisation.id
                }, knex, trx)
            } else {
                //TODO: Check if developer previously belongs to the organisation or add the dev to the org?
                //TODO: decide business rules for how we should allow someone to be added to an organisation
            }
    

            const organisationId = organisation.id
            const requestUserId = currentUserId
            const developerUserId = appDeveloper.id

            //Create the basic app
            const dbApp = await createAppAsync({ 
                userId: requestUserId,
                developerUserId,
                orgId: organisationId,
                appType: appJsonPayload.appType
            }, knex, trx)

            //Set newly uploaded apps as pending
            appUuid = dbApp.uuid
            await createAppStatusAsync({
                userId: requestUserId,      //the current user set the status
                orgId: organisationId,
                appId: dbApp.id,
                status: AppStatus.PENDING
            }, knex, trx)

            //Create the version of the app
            const { demoUrl, sourceUrl, version } =  appJsonPayload.versions[0]
            const appVersion = await createAppVersionAsync({
                userId: requestUserId,
                orgId: organisationId,
                appId: dbApp.id,
                demoUrl,
                sourceUrl,
                version
            }, knex, trx)
            versionUuid = appVersion.uuid

            //Add the texts as english language, only supported for now
            await createLocalizedAppVersionAsync({
                userId: requestUserId, 
                appVersionId: appVersion.id,
                description: appJsonPayload.description,
                name: appJsonPayload.name,
                languageCode: 'en'
            }, knex, trx)

            //Publish the app to Stable channel by default
            const { minDhisVersion, maxDhisVersion } = appJsonPayload.versions[0]
            await addAppVersionToChannelAsync({
                appVersionId: appVersion.id,
                createdByUserId: currentUserId,
                channelName: 'Stable',
                minDhisVersion,
                maxDhisVersion
            }, knex, trx)


            if ( imageFile ) {
                console.log('Inserting logo metadata to db and link it to the appVersion')
                const imageFileMetadata = imageFile.hapi

                const { id, uuid } = await addAppVersionMediaAsync({
                    userId: requestUserId,
                    appVersionId: appVersion.id,
                    imageType: ImageType.Logo,
                    fileName: imageFileMetadata.filename,
                    mime: imageFileMetadata.headers['content-type']
                }, knex, trx)


                console.log(`Logo inserted with id '${id}' and uuid '${uuid}'`)
                iconUUid = uuid
            }


        } catch ( err ) {
            console.log('ROLLING BACK TRANSACTION')
            console.log(err)
            await trx.rollback()
            throw Boom.badRequest(err.message, err)
        }

        if ( appUuid === null || versionUuid === null ) {
            await trx.rollback()
            throw Boom.internal('Could not create app')
        }

        await trx.commit()

        
        try  {
            const appUpload = saveFile(`${appUuid}/${versionUuid}`, 'app.zip', file._data)
            if ( imageFile ) {
                const iconUpload = saveFile(`${appUuid}/${versionUuid}`, iconUUid, imageFile._data)
                await Promise.all([appUpload, iconUpload])
            } else {
                await appUpload
            }
            
        } catch (ex) {
            console.log(ex)
            throw Boom.internal(ex)
        }

        return {
            statusCode: 200,
            uuid: appUuid
        }
    }
}
