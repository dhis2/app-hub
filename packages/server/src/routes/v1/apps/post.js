const uuid = require('uuid/v4')
const CreateAppModel = require('../../../models/v1/in/CreateAppModel')

const AWSFileHandler = require('../../../utils/AWSFileHandler')

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
            failAction: async function(request, h, err) {
                console.dir(request.payload.app);
                if ( err.isJoi ) {  //schema validation error
                    throw Boom.badRequest('Schema validation error:' + JSON.stringify(err.details))
                }
                console.log("=================================================")
                console.dir(err);
                throw Boom.badRequest()
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            },
        },
        response: {
            status: {
                //200: CreateAppModel.def,
                //400: Joi.any(),
                //500: Joi.string()
            },
            failAction: async function(request, h, err) {
                
                if ( err.isJoi ) {  //schema validation error
                    throw Boom.badImplementation('Schema validation error:' + JSON.stringify(err.details))
                }
                console.log("=================================================")
                console.dir(err);
                throw Boom.badImplementation()
            }
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)
        request.logger.info(`app id: ${request.params.app_uuid}`)

        const app = request.payload.app;
        const appJsonPayload = JSON.parse(app._data.toString('utf8').trim())
        const appJsonValidationResult = CreateAppModel.def.validate(appJsonPayload);
        if ( appJsonValidationResult.error !== null ) {
            throw Boom.badRequest(appJsonValidationResult.error)
        }

        //TODO: see if current authed user exists or create a new user/organisation

        //generate a new uuid to insert
        const app_uuid = uuid()

        const knex = h.context.db;

        let insertedAppId = -1;
        try {
            insertedAppId = await knex('app').insert({
                created_at: knex.fn.now(),
                created_by_user_id: 1,  //todo: change to real id
                organisation_id: 1,     //todo: change to real id
                type: appJsonPayload.appType,
                uuid: app_uuid
            }).returning('id')

            if ( insertedAppId <= 0 ) {
                throw new Error("Could not insert app to database")
            }

            console.log("Inserted app with id: ", insertedAppId)

            //TODO: insert version, localized, developer, etc...
        } catch ( err ) {
            console.log(err)
            throw Boom.internal(err)
        }

        const fileHandler = new AWSFileHandler(process.env.AWS_REGION,
                                               process.env.AWS_BUCKET_NAME)

        const imageFile = request.payload.imageFile;
        const file = request.payload.file;

        try  {
            const appUpload = fileHandler.saveFile(app_uuid, 'app.zip', file._data)
            const iconUpload = fileHandler.saveFile(app_uuid, 'icon', imageFile._data)
            const results = await Promise.all([appUpload, iconUpload])
            console.log("result:", results)

        } catch (ex) {
            console.log(ex)
            throw Boom.internal(ex)
        }
        
        return { statusCode: 200 }
    }   
}