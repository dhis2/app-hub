//const Boom = require('@hapi/boom')
const Joi = require('../../utils/CustomJoi')

// const AppVersionModel = require('../../models/v2/AppVersion')

const CHANNELS = ['stable', 'development', 'canary']

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
                query: Joi.object({
                    version: Joi.filter(Joi.string()).description(
                        'Version of the app'
                    ),
                    channel: Joi.filter(
                        Joi.stringArray().items(Joi.valid(...CHANNELS))
                    ).description('Filter by channel of the version'),
                }),
            },
            plugins: {
                pagination: {
                    enabled: true,
                },
                queryFilter: {
                    enabled: true,
                },
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { appId } = request.params
            const filters = request.plugins.queryFilter
            const pager = request.plugins.pagination
            const { appVersionService } = request.services(true)

            const versions = await appVersionService.findByAppId(
                appId,
                { pager, filters },
                db
            )

            return h.response(versions)
        },
    },
]
