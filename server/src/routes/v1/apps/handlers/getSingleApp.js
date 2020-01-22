const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

const debug = require('debug')('apphub:server:routes:v1:apps:getSingleApp')

const AppModel = require('../../../../models/v1/out/App')
const { AppStatus } = require('../../../../enums')

const defaultFailHandler = require('../../defaultFailHandler')

const getAppsById = require('../../../../data/getAppsById')
const getAppsByIdAndStatus = require('../../../../data/getAppsByIdAndStatus')

const { convertAppsToApiV1Format } = require('../formatting')

const { canSeeAllApps } = require('../../../../security')

module.exports = {
    //unauthenticated endpoint returning the approved app for the specified appId
    method: 'GET',
    path: '/v1/apps/{appId}',
    config: {
        auth: { strategy: 'token', mode: 'try' },
        tags: ['api', 'v1'],
        response: {
            status: {
                200: AppModel.def,
                404: Joi.any(),
                500: Joi.any(),
            },
            failAction: defaultFailHandler,
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        const appId = request.params.appId

        debug(`Getting app with appId: ${appId}`)

        let apps = null

        if (canSeeAllApps(request)) {
            debug('Can see all apps, fetch it no matter its status')
            apps = await getAppsById(appId, 'en', h.context.db)
        } else {
            debug('Can NOT see all apps, fetch it only if approved')
            apps = await getAppsByIdAndStatus(
                appId,
                AppStatus.APPROVED,
                'en',
                h.context.db
            )
            debug('Got apps:', apps)
        }

        if (!apps || apps.length === 0) {
            debug('Not found! Apps array is empty')
            throw Boom.notFound('No apps found')
        }

        const v1FormattedArray = convertAppsToApiV1Format(apps, request)

        if (v1FormattedArray.length === 0) {
            debug('Not found! Formatted array is empty')
            throw Boom.notFound('No apps found')
        }

        return v1FormattedArray[0]
    },
}
