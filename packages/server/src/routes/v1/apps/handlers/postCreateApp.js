const path = require('path')

const Boom = require('boom')

const CreateAppModel = require('../../../../models/v1/in/CreateAppModel')
const { AppStatus, ImageType } = require('@enums')

const defaultFailHandler = require('../../defaultFailHandler')
const AWSFileHandler = require('../../../../utils/AWSFileHandler')

const { canCreateApp } = require('../../../../security')

const createAppAsync = require('@data/createAppAsync')
const createAppStatusAsync = require('@data/createAppStatusAsync')
const createAppVersionAsync = require('@data/createAppVersionAsync')
const createLocalizedAppVersionAsync = require('@data/createLocalizedAppVersionAsync')
const addAppVersionToChannelAsync = require('@data/addAppVersionToChannelAsync')
const addAppVersionMediaAsync = require('@data/addAppVersionMediaAsync')

module.exports = {
    method: 'POST',
    path: '/v1/apps',
    config: {
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
        request.logger.info(`app id: ${request.params.appUUID}`)

        if ( !canCreateApp(request, h) ) {
            throw Boom.unauthorized()
        }

        const app = request.payload.app
        const appJsonPayload = JSON.parse(app._data.toString('utf8').trim())
        const appJsonValidationResult = CreateAppModel.def.validate(appJsonPayload)

        if ( appJsonValidationResult.error !== null ) {
            throw Boom.badRequest(appJsonValidationResult.error)
        }

        console.log('Received json: ', appJsonPayload)

        const knex = h.context.db

        const imageFile = request.payload.imageFile

        const file = request.payload.file
        const packageFileMetadata = file.hapi
        

        //TODO: see if current authed user exists or create a new user/organisation
        const currentUserId = 2
        const organisationId = 1
        let appUuid = null
        let versionUuid = null
        let iconUUid = null

        const createTransaction = () => {

            return new Promise((resolve) => {

                return knex.transaction(resolve);
            });
        }

        const trx = await createTransaction()

        try {
            let userAndOrgIds = { userId: currentUserId, orgId: organisationId }

            //Create the basic app
            const dbApp = await createAppAsync({ 
                ...userAndOrgIds,
                appType: appJsonPayload.appType
            }, knex, trx)

            //Set newly uploaded apps as pending
            appUuid = dbApp.uuid
            await createAppStatusAsync({
                ...userAndOrgIds,
                appId: dbApp.id,
                status: AppStatus.PENDING
            }, knex, trx)

            //Create the version of the app
            const { demoUrl, sourceUrl, version } =  appJsonPayload.versions[0]
            const appVersion = await createAppVersionAsync({
                ...userAndOrgIds, 
                appId: dbApp.id,
                demoUrl,
                sourceUrl,
                version
            }, knex, trx)
            versionUuid = appVersion.uuid

            //Add the texts as english language, only supported for now
            await createLocalizedAppVersionAsync({
                ...userAndOrgIds, 
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
                console.log('Inserting logo to db')
                const imageFileMetadata = imageFile.hapi

                const { id, uuid } = await addAppVersionMediaAsync({
                    ...userAndOrgIds,
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
            throw Boom.internal('Could not create app', err)
        }

        if ( appUuid === null || versionUuid === null ) {
            await trx.rollback()
            throw Boom.internal('Could not create app')
        }

        await trx.commit()

        const fileHandler = new AWSFileHandler(process.env.AWS_REGION, process.env.AWS_BUCKET_NAME)

        try  {
            const appUpload = fileHandler.saveFile(`${appUuid}/${versionUuid}`, 'app.zip', file._data)
            if ( imageFile ) {
                const iconUpload = fileHandler.saveFile(`${appUuid}/${versionUuid}`, iconUUid, imageFile._data)
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
