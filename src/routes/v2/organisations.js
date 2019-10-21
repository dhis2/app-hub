const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

const OrgModel = require('../../models/v2/out/Organisation')
module.exports = [
    {
        method: 'GET',
        path: '/v2/organisations',
        config: {
            tags: ['api', 'v2'],
            response: {
                schema: Joi.array().items(OrgModel.def),
                failAction: (request, h, err) => {
                    request.logger.info(err)
                    throw Boom.internal
                },
            },
        },
        handler: (request, h) => {
            console.log(request.query)
            //if(request.param)
            throw Boom.notImplemented()
        },
    },
]
