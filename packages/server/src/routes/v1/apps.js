const Boom = require('boom')
const Joi = require('joi')
const { AppStatus } = require('../../enums')

const AppModel = require('../../models/v1/out/App')

const { getAppsByStatusAndLanguage, getAllAppsByLanguage } = require('./apps/data')
const { convertAppsToApiV1Format } = require('./apps/formatting')

const defaultFailHandler = async function(request, h, err) {
    console.log("=================================================")
    console.dir(err);
    if ( err.isJoi ) {  //schema validation error
        throw Boom.badImplementation('Schema validation error:' + JSON.stringify(err.details))
    }
    throw Boom.badImplementation()
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
                failAction: defaultFailHandler
            },
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            console.log("fetching apps from db")
            const apps = await getAppsByStatusAndLanguage(AppStatus.APPROVED, 'en', h.context.db)

            console.log("converting apps")
            const formatted = convertAppsToApiV1Format(apps, request)
            console.log(formatted)

            return formatted
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
                failAction: defaultFailHandler
            },
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            const apps = await getAllAppsByLanguage('en', h.context.db)

            return convertAppsToApiV1Format(apps)
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
                failAction: defaultFailHandler
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
                    const v1App = convertDbAppViewRowToAppApiV1Object(app);
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
                failAction: defaultFailHandler
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
                failAction: defaultFailHandler
            },
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)
            request.logger.info(`app id: ${request.params.app_uuid}`)
            request.logger.info(request.payload)
            return {payload: request.payload, id: request.params.app_uuid}
        }
    },
    require('./apps/post')
]
