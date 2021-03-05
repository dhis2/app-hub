//const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

// const AppVersionModel = require('../../models/v2/AppVersion')
// const AppVersionService = require('../../services/appVersion')

module.exports = [
    {
        method: 'GET',
        path: '/v2/apps/{appId}/versions',
        config: {
            tags: ['api', 'v2'],
            response: {
                // schema: Joi.array().items(AppVersionModel.def),
            },
            validate: {
                params: Joi.object({
                    appId: Joi.string().required(),
                }),
            },
            plugins: {
                pagination: {
                    enabled: true,
                },
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { appId } = request.params
            //            const filters = request.plugins.queryFilter
            const pager = request.plugins.pagination
            const {
                appVersion: appVersionMethods,
            } = request.server.methods.services

            const { value, cached } = await appVersionMethods.findByAppId(
                appId,
                { pager },
                db
            )
            const lastModified = cached ? new Date(cached.stored) : new Date()

            return h.response(value).header('Last-modified', lastModified)
        },
    },
]
