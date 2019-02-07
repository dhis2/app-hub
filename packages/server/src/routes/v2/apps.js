const Boom = require('boom')
const Joi = require('joi')

const { AppStatus } = require('../../enums')

const AppModel = require('../../models/v2/out/App')

module.exports = [
    {
        method: 'GET',
        path: '/v2/apps',
        config: {
            tags: ['api', 'v2'],
            response: {
                schema: Joi.array().items(AppModel.def),
                failAction: async function(request, h, err) {
                    request.logger.info(err);
                    throw Boom.internal;
                }
            },
        },
        handler: async (request, h) => {
            throw Boom.notImplemented()
        }
        
    }
]
