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

            return channels.map(channel => ({
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
                throw Boom.unauthorized()
            }

            const { name } = request.payload
            let newChannel = null

            const knex = h.context.db
            const transaction = await knex.transaction()

            try {
                const existingChannel = await knex('channel')
                    .select('id')
                    .where('name', name)
                if (existingChannel && existingChannel.length > 0) {
                    return Boom.badRequest(
                        'A channel with that name already exists.'
                    )
                }
                newChannel = await createChannel({ name }, knex, transaction)
                await transaction.commit()
            } catch (err) {
                await transaction.rollback()
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
                throw Boom.unauthorized()
            }

            const { name } = request.payload
            const { id } = request.params
            let channel = null

            try {
                const knex = h.context.db
                const transaction = await knex.transaction()
                channel = await renameChannel({ id, name }, knex, transaction)
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
                .where('channel_id', request.params.id)

            const apps = {}
            channelApps.forEach(app => {
                if (!apps[app.id]) {
                    apps[app.id] = []
                }

                const version = apps[app.id].find(
                    x => x.version === app.version
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

            if (!currentUserIsManager(request)) {
                throw Boom.unauthorized()
            }

            const { uuid } = request.params
            const knex = h.context.db

            try {
                const trx = await knex.transaction()
                const result = await deleteChannel(uuid, knex, trx)

                if (result.success) {
                    await trx.commit()
                    return h.response().code(204)
                } else {
                    await trx.rollback()
                    return h
                        .response({
                            message: result.message,
                        })
                        .code(400)
                }
            } catch (err) {
                await trx.rollback()
                return Boom.internal(err.message)
            }
        },
    },
]
