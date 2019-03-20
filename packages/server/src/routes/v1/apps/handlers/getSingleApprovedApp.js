

const Boom = require('boom')
const Joi = require('joi')

const AppModel = require('../../../../models/v1/out/App')
const { AppStatus } = require('@enums')

const defaultFailHandler = require('../../defaultFailHandler')

const getAppsByUuidAsync = require('@data/getAppsByUuidAsync')
const getAppsByUuidAndStatusAsync = require('@data/getAppsByUuidAndStatusAsync')

const convertAppsToApiV1Format = require('../formatting/convertAppsToApiV1Format')

const { canSeeAllApps } = require('@security')

module.exports = {
    //unauthenticated endpoint returning the approved app for the specified uuid
    method: 'GET',
    path: '/v1/apps/{appUUID}',
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
        }
    },
    handler: async (request, h) => {

        request.logger.info('In handler %s', request.path)

        const appUUID = request.params.appUUID;


        let apps = null

        if ( canSeeAllApps(request) ) {
            apps = await getAppsByUuidAsync(appUUID, 'en', h.context.db)
        } else {
            apps = await getAppsByUuidAndStatusAsync(appUUID, AppStatus.APPROVED, 'en', h.context.db)
        }

        const v1FormattedArray = convertAppsToApiV1Format(apps, request)

        if ( v1FormattedArray.length === 0 ) {
            throw Boom.notFound()
        }

        return v1FormattedArray[0];
    }
}
