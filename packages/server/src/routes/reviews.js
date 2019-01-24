const Boom = require('boom')

module.exports = [
    {
        method: 'GET',
        path: '/reviews',
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            throw Boom.notImplemented()
        },
    },
    {
        method: 'GET',
        path: '/reviews/{uuid}',
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            return await h.context
                .db('reviews')
                .innerJoin('apps', 'reviews.app', 'apps.app_id')
                .where('apps.uuid', request.params.uuid)
        },
    },
]
