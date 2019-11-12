const Boom = require('@hapi/boom')
const createChannel = require('../../data/createChannel')

const {
    getCurrentAuthStrategy,
    currentUserIsManager,
} = require('../../security')

module.exports = [
    {
        method: 'GET',
        path: '/v2/channels',
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
        method: 'POST',
        path: '/v2/channels',
        config: {
            auth: getCurrentAuthStrategy(),
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            if (!currentUserIsManager(request)) {
                throw Boom.unauthorized()
            }

            const { name } = request.payload
            let uuid = null

            try {
                //TODO: check if a channel already exists and respond with a 409 conflict
                const knex = h.context.db
                const transaction = await knex.transaction()
                ;({ uuid } = await createChannel({ name }, knex, transaction))
                await transaction.commit()
            } catch (err) {
                return Boom.internal(`Could not create channel: ${err.message}`)
            }

            if (!uuid) {
                return Boom.internal(`Could not create channel`)
            }

            return uuid
        },
    },
    {
        method: 'GET',
        path: '/v2/channels/{id}',
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
