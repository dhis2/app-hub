const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

const AppModel = require('../../models/v2/out/App')

module.exports = [
    {
        method: 'GET',
        path: '/v2/apps',
        config: {
            tags: ['api', 'v2'],
            response: {
                schema: Joi.array().items(AppModel.def),
                failAction: (request, h, err) => {
                    request.logger.info(err)
                    throw Boom.internal
                },
            },
        },
        handler: (request, h) => {
            throw Boom.notImplemented()
        },
    },
]
