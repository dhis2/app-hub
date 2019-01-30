const Boom = require('boom')
const { AppStatus } = require('../enums')

module.exports = [
    {
        method: 'GET',
        path: '/apps',
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)
            const apps = await h.context.db
                .select()
                .from('apps_view')
                .where('status', AppStatus.APPROVED)

            request.logger.info(apps)
            return apps.map(app => ({
                type: app.type,
                uuid: app.uuid,
                version: app.version,
                supported_dhis2_version: {
                    min: app.min_dhis2_version,
                    max: app.max_dhis2_version,
                },
                channel: { name: app.channel_name, id: app.channel_uuid },
            }))
        },
    },
    {
        method: 'POST',
        path: '/apps',
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            throw Boom.notImplemented()
        },
    },
    {
        method: 'GET',
        path: '/apps/all',
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)
            return await h.context.db.select().from('apps')
        },
    },
    {
        method: 'GET',
        path: '/apps/{id}',
        handler: async (request, h) => {
            request.logger.info(
                'In handler %s, looking for %s',
                request.path,
                request.params.id
            )
            return await h.context.db
                .first()
                .from('apps')
                .where('uuid', request.params.id)
        },
    },
    {
        method: 'PUT',
        path: '/apps/{id}',
        handler: async (request, h) => {
            request.logger.info(
                'In handler %s, looking for %s',
                request.path,
                request.params.id
            )
            throw Boom.notImplemented()
        },
    },
    {
        method: 'DELETE',
        path: '/apps/{id}',
        handler: async (request, h) => {
            request.logger.info(
                'In handler %s, looking for %s',
                request.path,
                request.params.id
            )
            throw Boom.notImplemented()
        },
    },
]
