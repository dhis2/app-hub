const Boom = require('@hapi/boom')
const createChannel = require('../../data/createChannel')
const renameChannel = require('../../data/renameChannel')

const EditChannelModel = require('../../models/v2/in/EditChannelModel')

const { currentUserIsManager } = require('../../security')

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
            auth: 'required',
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            if (!currentUserIsManager(request)) {
                throw Boom.unauthorized()
            }

            const { name } = request.payload
            let newChannel = null

            try {
                //TODO: check if a channel already exists and respond with a 409 conflict
                const knex = h.context.db
                const transaction = await knex.transaction()
                newChannel = await createChannel({ name }, knex, transaction)
                await transaction.commit()
            } catch (err) {
                return Boom.internal(`Could not create channel: ${err.message}`)
            }

            return newChannel
        },
    },
    {
        method: 'PUT',
        path: '/v2/channels/{uuid}',
        config: {
            validate: {
                payload: EditChannelModel.payloadSchema,
                failAction: (request, h, err) => {
                    return err
                },
            },
            auth: 'required',
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            console.log(request.auth)

            if (!currentUserIsManager(request)) {
                throw Boom.unauthorized()
            }

            const { name } = request.payload
            const uuid = request.params.uuid
            let channel = null

            try {
                const knex = h.context.db
                const transaction = await knex.transaction()
                channel = await renameChannel({ uuid, name }, knex, transaction)
                await transaction.commit()
            } catch (err) {
                return Boom.internal(`Could not update channel: ${err.message}`)
            }

            return channel
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
