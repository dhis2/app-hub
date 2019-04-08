

const Boom = require('boom')
const Joi = require('joi')

const AppModel = require('../../../../models/v1/out/App')

const defaultFailHandler = require('../../defaultFailHandler')

const { getCurrentAuthStrategy } = require('@security')

module.exports = {
    //unauthenticated endpoint returning the approved app for the specified uuid
    method: 'GET',
    path: '/v1/apps/myapps',
    config: {
        auth: getCurrentAuthStrategy(),
        tags: ['api', 'v1'],
        response: {
            status: {
                200: Joi.array().items(AppModel.def),
                500: Joi.string()
            },
            failAction: defaultFailHandler
        }
    },
    handler: (request, h) => {

        request.logger.info('In handler %s', request.path)

        //TODO: implement fetching of apps for which the current user has access to, E.G. the organisations it belongs to

        return Boom.notImplemented()
    }
}
