const { AppStatus } = require('@enums')

const { getAppsByStatusAndLanguage } = require('@data')
const { convertAppsToApiV1Format } = require('../formatting')

module.exports = {
    //unauthenticated endpoint returning all approved apps
    method: 'GET',
    path: '/v1/apps',
    config: {
        //auth: false,
        tags: ['api', 'v1'],
        response: {
            status: {
                // 200: Joi.array().items(AppModel.def),
                // 500: Joi.string()
            }
        }
    },
    handler: async (request, h) => {

        request.logger.info('In handler %s', request.path)

        const apps = await getAppsByStatusAndLanguage(AppStatus.APPROVED, 'en', h.context.db);

        return convertAppsToApiV1Format(apps, request)
    }
}
