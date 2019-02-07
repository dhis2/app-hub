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
                console.log("Checking app: "+ app.uuid)

                let currentApp = formattedApps[app.uuid];
                if ( !currentApp ) {
                    const basicAppInfo = {
                        appType: app.type,

                        status: app.status,

                        id: app.uuid,
                        created: app.status_created_at,
                        lastUpdated: app.version_created_at,

                        name: app.name,
                        description: app.description,
                        
                       versions: [],
                //       developer: {address:'', email: '', organisation: '', name:''},
                //       images: [],
                        
            //           sourceUrl: '',
            //           owner: '',
            //         reviews: ''
                        //channel: { name: app.channel_name, id: app.channel_uuid }
                    }
                    currentApp = formattedApps[app.uuid] = basicAppInfo
                }
                
                
             currentApp.versions.push({
                    created: app.version_created_at,
                    demoUrl: '',
                    downloadUrl: '',
                    id: app.version_uuid,
                    lastUpdated: app.version_created_at,
                    maxDhisVersion: app.max_dhis2_version,
                    minDhisVersion: app.min_dhis2_version,
                    version: app.version
                })

            })

            console.log(JSON.stringify(formattedApps))
            return Object.keys(formattedApps).map(id => (formattedApps[id]))
        }
    }
]