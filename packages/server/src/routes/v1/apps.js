const Boom = require('boom')
const Joi = require('joi')
const { AppStatus } = require('../../enums')

const AppModel = require('../../models/v1/out/App')


module.exports = [
    {
        method: 'GET',
        path: '/v1/apps',
        config: {
            tags: ['api', 'v1'],
            response: {
                status: {
                    200: Joi.array().items(AppModel.def),

                    500: Joi.string()
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
                    currentApp = formattedApps[app.uuid] = basicAppInfo
                }
                
                
                currentApp.versions.push({
                    created: +new Date(app.version_created_at),
                    demoUrl: '',
                    downloadUrl: '',
                    id: app.version_uuid,
                    lastUpdated: +new Date(app.version_created_at),
                    maxDhisVersion: app.max_dhis2_version,
                    minDhisVersion: app.min_dhis2_version,
                    version: app.version
                })
            })

            return Object.keys(formattedApps).map(id => (formattedApps[id]))
        }
    }
]