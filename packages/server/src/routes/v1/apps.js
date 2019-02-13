const Boom = require('boom')
const Joi = require('joi')
const { AppStatus } = require('../../enums')
const uuid = require('uuid/v4')

const AppModel = require('../../models/v1/out/App')
const CreateAppModel = require('../../models/v1/in/CreateAppModel')

function convertAppToV1App(app) {
    const basicAppInfo = {
        appType: app.type,

        status: app.status,

        id: app.uuid,
        created: +new Date(app.status_created_at),
        lastUpdated: + new Date(app.version_created_at),

        name: app.name,
        description: app.description,
        
        versions: [],
        developer: {address:'', email: 'test@test.com', organisation: 'test', name:'tester'},
        owner: 'oauth-token|id',
        images: [],

        sourceUrl: '',
        reviews: []
    }
    return basicAppInfo;
}

function convertAppToV1AppVersion(app) {
    return ({
        created: +new Date(app.version_created_at),
        demoUrl: '',
        downloadUrl: 'https://dhis2-appstore.s3.amazonaws.com/apps-standard/5f576c33-ef7e-4389-84f0-a270860be6fa.zip',
        id: app.version_uuid,
        lastUpdated: +new Date(app.version_created_at),
        maxDhisVersion: app.max_dhis2_version,
        minDhisVersion: app.min_dhis2_version,
        version: app.version
    })
}

module.exports = [
    {
        //unauthenticated endpoint returning all approved apps
        method: 'GET',
        path: '/v1/apps',
        config: {
            //auth: false,
            tags: ['api', 'v1'],
            response: {
                status: {
                    200: Joi.array().items(AppModel.def),

                    500: Joi.string()
                },
                failAction: async function(request, h, err) {
                    console.log("=================================================")
                    console.dir(err);
                    if ( err.isJoi ) {  //schema validation error
                        throw Boom.badImplementation('Schema validation error:' + JSON.stringify(err.details))
                    }
                    throw Boom.badImplementation()
                }
            },
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            const apps = await h.context.db
                .select()
                .from('apps_view')
                .where({
                    'status': AppStatus.APPROVED,
                    'language_code': 'en'
                })

            const formattedApps = {};

            apps.forEach(app => {
                let currentApp = formattedApps[app.uuid];
                
                if ( !currentApp ) {
                    const v1App = convertAppToV1App(app);
                    formattedApps[app.uuid] = v1App;
                    currentApp = v1App;
                }
                    
                currentApp.versions.push(convertAppToV1AppVersion(app))
            })

            return Object.keys(formattedApps).map(id => (formattedApps[id]))
        }
    },
    {
        //authenticated endpoint returning all apps no matter which status they have
        method: 'GET',
        path: '/v1/apps/all',
        config: {
            //TODO: add auth
            //auth: 'jwt',
            tags: ['api', 'v1'],
            response: {
                status: {
                    200: Joi.array().items(AppModel.def),
                    500: Joi.string()
                },
                failAction: function(request, h, err) {
                    console.log("=================================================")
                    console.dir(err);
                    if ( err.isJoi ) {  //schema validation error
                        throw Boom.badImplementation('Schema validation error:' + JSON.stringify(err.details))
                    }
                    throw Boom.badImplementation()
                }
            },
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            const apps = await h.context.db
                .select()
                .from('apps_view')
                .where({
                    'language_code': 'en'
                })

            const formattedApps = {};

            apps.forEach(app => {
                let currentApp = formattedApps[app.uuid];
                
                if ( !currentApp ) {
                    const v1App = convertAppToV1App(app);
                    formattedApps[app.uuid] = v1App;
                    currentApp = v1App;
                }
                    
                currentApp.versions.push(convertAppToV1AppVersion(app))
            })

            return Object.keys(formattedApps).map(id => (formattedApps[id]))
        }
    },
    {
        //unauthenticated endpoint returning the approved app for the specified uuid
        method: 'GET',
        path: '/v1/apps/{app_uuid}',
        config: {
            auth: false,
            tags: ['api', 'v1'],
            response: {
                status: {
                    200: AppModel.def,

                    500: Joi.string()
                },
                failAction: async function(request, h, err) {
                    console.log("=================================================")
                    console.dir(err);
                    if ( err.isJoi ) {  //schema validation error
                        throw Boom.badImplementation('Schema validation error:' + JSON.stringify(err.details))
                    }
                    throw Boom.badImplementation()
                }
            },
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)
            //request.logger.info(`app id: ${request.params.app_uuid}`)
            const app_uuid = request.params.app_uuid;

            const apps = await h.context.db
                .select()
                .from('apps_view')
                .where({
                    'status': AppStatus.APPROVED,
                    'language_code': 'en',
                    'uuid': app_uuid
                })

            const formattedApps = {};

            apps.forEach(app => {
                let currentApp = formattedApps[app.uuid];
                
                if ( !currentApp ) {
                    const v1App = convertAppToV1App(app);
                    formattedApps[app.uuid] = v1App;
                    currentApp = v1App;
                }
                    
                currentApp.versions.push(convertAppToV1AppVersion(app))
            })

            return formattedApps[app_uuid]
        }
    },
    {
        //unauthenticated endpoint returning the approved app for the specified uuid
        method: 'GET',
        path: '/v1/apps/myapps',
        config: {
            auth: false,
            tags: ['api', 'v1'],
            response: {
                status: {
                    200: Joi.array().items(AppModel.def),
                    500: Joi.string()
                },
                failAction: async function(request, h, err) {
                    console.log("=================================================")
                    console.dir(err);
                    if ( err.isJoi ) {  //schema validation error
                        throw Boom.badImplementation('Schema validation error:' + JSON.stringify(err.details))
                    }
                    throw Boom.badImplementation()
                }
            },
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)
            //request.logger.info(`app id: ${request.params.app_uuid}`)
            return Boom.notImplemented()
        }
    },
    {
        method: 'POST',
        path: '/v1/apps/{app_uuid}',
        config: {
            tags: ['api', 'v1'],
            response: {
                status: {
                    //200: Joi.array().items(AppModel.def),

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
            request.logger.info(request.payload)
            return {payload: request.payload, id: request.params.app_uuid}
        }   
    },
    {
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

            try {
                const insertedApp = await knex('app').insert({
                    created_at: knex.fn.now(),
                    created_by_user_id: 1,
                    organisation_id: 1,
                    type: appJsonPayload.appType,
                    uuid: app_uuid
                })
                console.log("======================>", insertedApp)
            } catch ( err ) {
                console.log(err)
                throw Boom.internal(err)
            }


            //TODO: upload files to S3
            const imageFile = request.payload.imageFile;
            const file = request.payload.file;
            
            
            return {statusCode: 200}
        }   
    }
]