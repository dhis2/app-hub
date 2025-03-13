const debug = require('debug')('apphub:server:routes:channels')

const Boom = require('@hapi/boom')
const createChannel = require('../../data/createChannel')
const renameChannel = require('../../data/renameChannel')
const deleteChannel = require('../../data/deleteChannel')

const EditChannelModel = require('../../models/v2/in/EditChannelModel')

const { currentUserIsManager } = require('../../security')

module.exports = [
    {
        method: 'GET',
        path: '/v2/channels',
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)
            const channels = await h.context.db.select().from('channel')

            return channels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                uri: `${request.path}/${channel.id}`,
            }))
        },
    },
    {
        method: 'POST',
        path: '/v2/channels',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            if (!currentUserIsManager(request)) {
                throw Boom.forbidden()
            }

            const { name } = request.payload
            let newChannel = null

            const knex = h.context.db

            try {
                const existingChannel = await knex('channel')
                    .select('id')
                    .where('name', name)
                if (existingChannel && existingChannel.length > 0) {
                    return Boom.badRequest(
                        'A channel with that name already exists.'
                    )
                }
                newChannel = await createChannel({ name }, knex)
            } catch (err) {
                return Boom.internal(`Could not create channel: ${err.message}`)
            }

            return newChannel
        },
    },
    {
        method: 'PUT',
        path: '/v2/channels/{id}',
        config: {
            validate: {
                payload: EditChannelModel.payloadSchema,
                failAction: (request, h, err) => {
                    return err
                },
            },
            auth: 'token',
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            console.log(request.auth)

            if (!currentUserIsManager(request)) {
                throw Boom.forbidden()
            }

            const { name } = request.payload
            const { id } = request.params
            let channel = null

            try {
                const knex = h.context.db
                channel = await renameChannel({ id, name }, knex)
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
                .where('channel_id', request.params.id)

            const apps = {}
            channelApps.forEach((app) => {
                if (!apps[app.id]) {
                    apps[app.id] = []
                }

                const version = apps[app.id].find(
                    (x) => x.version === app.version
                )

                if (!version) {
                    apps[app.id].push({
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
    {
        method: 'DELETE',
        path: '/v2/channels/{uuid}',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)
            debug('delete channel')

            if (!currentUserIsManager(request)) {
                debug('unauthorized')
                throw Boom.forbidden()
            }

            const { uuid } = request.params
            const db = h.context.db

            debug(`uuid: ${uuid}`)

            const deleteChannelWorkUnit = async (trx) => {
                await deleteChannel(uuid, trx)
            }

            return db.transaction(deleteChannelWorkUnit)
        },
    },
]
