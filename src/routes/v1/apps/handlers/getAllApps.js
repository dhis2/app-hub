const debug = require('debug')('appstore:server:routes:handlers:v1:getAllApps')
const Boom = require('boom')
const Joi = require('@hapi/joi')

const AppModel = require('../../../../models/v1/out/App')
const defaultFailHandler = require('../../defaultFailHandler')
const { getAllAppsByLanguage } = require('../../../../data')
const { convertAppsToApiV1Format } = require('../formatting')

const { canSeeAllApps } = require('../../../../security')

const { getCurrentAuthStrategy } = require('../../../../security')

module.exports = {
    //authenticated endpoint returning all apps no matter which status they have
    method: 'GET',
    path: '/v1/apps/all',
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
        if (!canSeeAllApps(request, h)) {
            throw Boom.unauthorized()
        }

        try {
            const apps = await getAllAppsByLanguage('en', h.context.db)
            return convertAppsToApiV1Format(apps, request)
        } catch (err) {
            debug(err)
        }

        return []
    },
}
