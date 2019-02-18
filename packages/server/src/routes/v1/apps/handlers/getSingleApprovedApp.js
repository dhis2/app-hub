const Boom = require('boom')
const Joi = require('joi')

const AppModel = require('../../../../models/v1/out/App')
const { AppStatus } = require('../../../../enums')

const defaultFailHandler = require('../../defaultFailHandler')
const { getAppsByUUID } = require('../data')
const { convertAppsToApiV1Format } = require('../formatting')

module.exports = {
    //unauthenticated endpoint returning the approved app for the specified uuid
    method: 'GET',
    path: '/v1/apps/{app_uuid}',
    config: {
        auth: false,
        tags: ['api', 'v1'],
        response: {
            status: {
                200: AppModel.def,
                404: Joi.string(),
                500: Joi.string()
            },
            failAction: defaultFailHandler
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)
        //request.logger.info(`app id: ${request.params.app_uuid}`)
        const app_uuid = request.params.app_uuid;

        const apps = getAppsByUUID(app_uuid, AppStatus.APPROVED, 'en')

        const v1FormattedArray = convertAppsToApiV1Format(apps);
        if ( v1FormattedArray.length < 1 ) {
            throw Boom.notFound()
        }

        return v1FormattedArray[0];
    }
}