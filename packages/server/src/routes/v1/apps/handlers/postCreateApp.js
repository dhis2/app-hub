

const Boom = require('boom')

const slugify = require('slugify')

const uuid = require('uuid/v4')
const CreateAppModel = require('../../../../models/v1/in/CreateAppModel')
const { AppStatus } = require('@enums')

const defaultFailHandler = require('../../defaultFailHandler')
const AWSFileHandler = require('../../../../utils/AWSFileHandler')

const { canCreateApp } = require('../../../../security')

const createAppAsync = require('@data/createApp')

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
        //TODO: see if current authed user exists or create a new user/organisation

        //generate a new uuid to insert
        const appUUID = uuid()
        const versionUUID = uuid()

        const knex = h.context.db;

        let insertedAppId = -1;
        let insertedVersionId = -1;
        let insertedLocalisedAppVersionId = -1;

        //knex.transaction(async(trx) => {
        try {
            //TODO: transaction
            //TODO: upsert developer and organisation
            const trx = knex.transaction()

            //TODO insert real org id / dev id
            insertedAppId = await createAppAsync(2, 1, appJsonPayload.appType, appUUID, trx)

            if ( insertedAppId[0] <= 0 ) {
                trx.rollback()
                throw new Error('Could not insert app to database')
            }

            console.log('Inserted app with id: ', insertedAppId)

            await knex('app_status').insert({
                created_at: knex.fn.now(),
                created_by_user_id: 1,      //TODO: change to real id
                app_id: insertedAppId[0],   //TODO: change to real id
                status: AppStatus.PENDING   //TODO: set as pending after demo
            }).returning('id')

            insertedVersionId = await knex('app_version').insert({
                app_id: insertedAppId[0],
                created_at: knex.fn.now(),
                created_by_user_id: 1,
                uuid: versionUUID,
                demo_url: appJsonPayload.versions[0].demoUrl,
                source_url: appJsonPayload.sourceUrl,
                version: appJsonPayload.versions[0].version
            }).returning('id')

            if ( insertedVersionId[0] <= 0 ) {
                throw new Error('Could not insert app to database')
            }

            console.log('Inserted app version with id: ', insertedVersionId)

            insertedLocalisedAppVersionId = await knex('app_version_localised').insert({
                app_version_id: insertedVersionId[0],
                created_at: knex.fn.now(),
                created_by_user_id: 1,  //todo: change to real id
                description: appJsonPayload.description,
                name: appJsonPayload.name,
                slug: slugify(appJsonPayload.name, { lower:true }),
                language_code: 'en'
            }).returning('id')

            console.log('Inserted localised app version with id: ', insertedLocalisedAppVersionId)

            await knex('app_channel').insert({
                app_version_id: insertedVersionId[0],
                channel_id: 1, //TODO: set dynamically
                created_at: knex.fn.now(),
                created_by_user_id: 2,  //TODO: set dynamically based on current user or provided data
                min_dhis2_version: appJsonPayload.versions[0].minDhisVersion,
                max_dhis2_version: appJsonPayload.versions[0].maxDhisVersion
            }).returning('id')

        } catch ( err ) {
            console.log(err)
            throw Boom.internal(err)
        }

        const fileHandler = new AWSFileHandler(process.env.AWS_REGION, process.env.AWS_BUCKET_NAME)

        const imageFile = request.payload.imageFile;
        const file = request.payload.file;

        try  {
            const appUpload = fileHandler.saveFile(`${appUUID}/${versionUUID}`, 'app.zip', file._data)
            const iconUpload = fileHandler.saveFile(`${appUUID}/${versionUUID}`, 'icon', imageFile._data)
            const results = await Promise.all([appUpload, iconUpload])
            console.log('result:', results)
        } catch (ex) {
            console.log(ex)
            throw Boom.internal(ex)
        }

        return { statusCode: 200 }
    }
}
