const Boom = require('boom')
const Joi = require('joi')

const AppModel = require('../../../../models/v1/out/App')
const { AppStatus } = require('../../../../enums')

const defaultFailHandler = require('../../defaultFailHandler')
const getAppsByUUID = require('../data/getAppsByUUID')
const convertAppsToApiV1Format = require('../formatting/convertAppsToApiV1Format')


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
        
        if ( )

        const app_uuid = request.params.app_uuid;

        const apps = await getAppsByUUID(app_uuid, AppStatus.APPROVED, 'en', h.context.db)

        const v1FormattedArray = convertAppsToApiV1Format(apps, request)



        if ( v1FormattedArray.length < 1 ) {
            throw Boom.notFound()
        }

        return v1FormattedArray[0];
    }
}