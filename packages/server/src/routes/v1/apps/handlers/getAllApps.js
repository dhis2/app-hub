const Boom = require('boom')
const Joi = require('joi')

const AppModel = require('../../../../models/v1/out/App')
const defaultFailHandler = require('../../defaultFailHandler')
const { getAllAppsByLanguage } = require('../data')
const { convertAppsToApiV1Format } = require('../formatting')

module.exports = {
    //authenticated endpoint returning all apps no matter which status they have
    method: 'GET',
    path: '/v1/apps/all',
    config: {
        //TODO: add auth
        //auth: 'jwt',
        tags: ['api', 'v1'],
        response: {
            status: {
                200: Joi.array().items(AppModel.def),
                500: Joi.string()
            },
            failAction: defaultFailHandler
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        const apps = await getAllAppsByLanguage('en', h.context.db)

        return convertAppsToApiV1Format(apps)
    }
}