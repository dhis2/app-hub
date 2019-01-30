const Boom = require('boom')
const { AppStatus } = require('../enums')

module.exports = [
    {
        method: 'GET',
        path: '/channels',
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)
            const channels = await h.context.db.select().from('channel')

            return channels.map(channel => ({
                uuid: channel.uuid,
                name: channel.name,
                uri: `${request.path}/${channel.uuid}`,
            }))
        },
    },
    {
        method: 'GET',
        path: '/channels/{id}',
        handler: async (request, h) => {
            request.logger.info(
                'In handler %s, looking for %s',
                request.path,
                request.params.id
            )
            const channelApps = await h.context.db
                .select()
                .from('apps_view')
                .where('channel_uuid', request.params.id)

            const apps = {}
            channelApps.forEach(app => {
                if (!apps[app.uuid]) {
                    apps[app.uuid] = []
                }

                const version = apps[app.uuid].find(
                    x => x.version === app.version
                )
                if (!version) {
                    apps[app.uuid].push({
                        version: app.version,
                        name: { [app.language_code]: app.name },
                    })
                } else {
                    version.name[app.language_code] = app.name
                }
            })

            return apps
        },
    },
]
