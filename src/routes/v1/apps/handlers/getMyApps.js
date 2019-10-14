const debug = require('debug')('appstore:server:routes:handlers:v1:getMyApps')
const Boom = require('boom')
const Joi = require('@hapi/joi')

const { getAllAppsByDeveloperUuid } = require('../../../../data')
const { convertAppsToApiV1Format } = require('../formatting')

const AppModel = require('../../../../models/v1/out/App')

const defaultFailHandler = require('../../defaultFailHandler')

const {
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
} = require('../../../../security')

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
                500: Joi.string(),
            },
            failAction: defaultFailHandler,
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        //TODO: implement fetching of apps for which the current user has access to, E.G. the organisations it belongs to

        try {
            const user = await getCurrentUserFromRequest(request, h.context.db)
            const apps = await getAllAppsByDeveloperUuid(
                user.uuid,
                h.context.db
            )
            return convertAppsToApiV1Format(apps, request)
        } catch (err) {
            debug(err)
        }

        return []
    },
}
