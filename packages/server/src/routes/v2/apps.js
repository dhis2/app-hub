const Boom = require('boom')
const Joi = require('joi')
const { AppStatus } = require('../../enums')

module.exports = [
    {
        method: 'GET',
        path: '/v2/apps',
        options: {
            tags: ['api', 'v2'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success',
                            schema: Joi.array().items(Joi.object({
                                name: Joi.string().label('V2 app name')
                            }))
                        }
                    }
                }
            },
        },

        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            const apiVersion = request.pre.apiVersion;
            request.logger.info(`Using api version: ${apiVersion}`)

            return ["foobar"];
            const apps = await h.context.db
                .select()
                .from('apps_view')
                .where({
                    'status': AppStatus.APPROVED,
                    'language_code': 'en'
                })

            const formattedApps = {};
            //request.logger.info(apps)
             apps.forEach(app => {
                console.log("Checking app: "+ app.uuid)

                let currentApp = formattedApps[app.uuid];
                if ( !currentApp ) {
                    const basicAppInfo = {
                        appType: app.type,
                        created: 123,
                        id: app.uuid,
                        description: app.description,
                        name: app.name,
                        status: app.status,
                        versions: [],
                        developer: {address:'', email: '', organisation: '', name:''},
                        images: [],
                        lastUpdated: 123,
                        sourceUrl: '',
                        owner: '',
                        reviews: ''
                        //channel: { name: app.channel_name, id: app.channel_uuid }
                    }
                    currentApp = formattedApps[app.uuid] = basicAppInfo
                }
                
                
                currentApp.versions.push({
                    created: app.version_created_at,
                    demoUrl: '',
                    downloadUrl: '',
                    id: app.version_uuid,
                    lastUpdated: 123,
                    maxDhisVersion: app.max_dhis2_version,
                    minDhisVersion: app.min_dhis2_version,
                    version: app.version
                })

            })

            return Object.keys(formattedApps).map(id => (formattedApps[id]));
        },
    }
]
