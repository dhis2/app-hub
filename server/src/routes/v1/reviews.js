const Boom = require('@hapi/boom')

module.exports = [
    {
        method: 'GET',
        path: '/reviews',
        handler: (request, h) => {
            request.logger.info('In handler %s', request.path)

            throw Boom.notImplemented()
        },
    },
    {
        method: 'GET',
        path: '/reviews/{appId}',
        handler: async (request, h) => {
            request.logger.info('In handler %s', request.path)

            const reviews = await h.context
                .db('reviews')
                .innerJoin('apps', 'reviews.app', 'apps.app_id')
                .where('apps.id', request.params.appId)

            return reviews
        },
    },
]
