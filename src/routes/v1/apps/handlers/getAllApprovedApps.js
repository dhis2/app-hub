const joi = require('@hapi/joi')

const AppModel = require('../../../../models/v1/out/App')

const { AppStatus } = require('../../../../enums')

const { getApps } = require('../../../../data')
const { convertAppsToApiV1Format } = require('../formatting')

module.exports = {
    //unauthenticated endpoint returning all approved apps
    method: 'GET',
    path: '/v1/apps',
    config: {
        auth: false,
        tags: ['api', 'v1'],
        response: {
            status: {
                200: joi.array().items(AppModel.def),
                500: joi.string(),
            },
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        //default to Stable if not specified
        const channel = request.query.channel || 'Stable'

        const apps = await getApps(
            {
                status: AppStatus.APPROVED,
                languageCode: 'en',
                channel,
            },
            h.context.db
        )

        return convertAppsToApiV1Format(apps, request)
    },
}
