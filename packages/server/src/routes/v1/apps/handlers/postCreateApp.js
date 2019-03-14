

const Boom = require('boom')

const CreateAppModel = require('../../../../models/v1/in/CreateAppModel')
const { AppStatus } = require('@enums')

const defaultFailHandler = require('../../defaultFailHandler')
const AWSFileHandler = require('../../../../utils/AWSFileHandler')

const { canCreateApp } = require('../../../../security')

const createAppAsync = require('@data/createAppAsync')
const createAppStatusAsync = require('@data/createAppStatusAsync')
const createAppVersionAsync = require('@data/createAppVersionAsync')
const createLocalizedAppVersionAsync = require('@data/createLocalizedAppVersionAsync')
const addAppVersionToChannelAsync = require('@data/addAppVersionToChannelAsync')

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
            throw Boom.unauthorized();
        }

        const app = request.payload.app;
        const appJsonPayload = JSON.parse(app._data.toString('utf8').trim())
        const appJsonValidationResult = CreateAppModel.def.validate(appJsonPayload);

        if ( appJsonValidationResult.error !== null ) {
            throw Boom.badRequest(appJsonValidationResult.error);
        }

        console.log('Received json: ', appJsonPayload)

        const knex = h.context.db;

        //TODO: see if current authed user exists or create a new user/organisation
        const currentUserId = 2
        const organisationId = 1
        let appUuid = null
        let versionUuid = null

        const trx = knex.transaction
        knex.transaction = (callback) => knex.transaction(callback)

        try {
            const app = await createAppAsync(currentUserId, organisationId, appJsonPayload.appType, knex, trx)
            appUuid = app.uuid
            await createAppStatusAsync(currentUserId, app.id, AppStatus.PENDING, knex, trx)

            const { demoUrl, sourceUrl, version } =  appJsonPayload.versions[0]
            const appVersion = await createAppVersionAsync(currentUserId, app.id, demoUrl, sourceUrl, version, knex, trx)
            versionUuid = appVersion.uuid

            await createLocalizedAppVersionAsync(currentUserId, appVersion.id , appJsonPayload.description, appJsonPayload.name, 'en', knex, trx)

            const { minDhisVersion, maxDhisVersion } = appJsonPayload.versions[0]
            await addAppVersionToChannelAsync(appVersion.id, currentUserId, 'Stable', minDhisVersion, maxDhisVersion, knex, trx)


        } catch ( err ) {
            await trx.rollback();
            console.log(err)
            throw Boom.internal(err)
        }

        if ( appUuid === null || versionUuid === null ) {
            await trx.rollback()
            throw Boom.internal(`Could not create app`)
        }

        await trx.commit()

        const fileHandler = new AWSFileHandler(process.env.AWS_REGION, process.env.AWS_BUCKET_NAME)

        const imageFile = request.payload.imageFile;
        const file = request.payload.file;

        try  {
            const appUpload = fileHandler.saveFile(`${appUuid}/${versionUuid}`, 'app.zip', file._data)
            const iconUpload = fileHandler.saveFile(`${appUuid}/${versionUuid}`, 'icon', imageFile._data)
            const results = await Promise.all([appUpload, iconUpload])
            console.log('result:', results)
        } catch (ex) {
            console.log(ex)
            throw Boom.internal(ex)
        }

        return { statusCode: 200 }
    }
}
