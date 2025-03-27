const Boom = require('@hapi/boom')
const Joi = require('joi')

const debug = require('debug')('apphub:server:routes:v1:apps:getSingleApp')

const AppModel = require('../../../../models/v1/out/App')
const { AppStatus } = require('../../../../enums')

const defaultFailHandler = require('../../defaultFailHandler')

const {
    getAppsByIdAndStatus,
    getAppsById,
    getOrganisationAppsByUserId,
} = require('../../../../data')

const { convertAppsToApiV1Format } = require('../formatting')

const {
    canSeeAllApps,
    getCurrentUserFromRequest,
} = require('../../../../security')

module.exports = {
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

        const { db } = h.context
        let apps = null

        let isDeveloper = false

        try {
            const currentUser = await getCurrentUserFromRequest(request, db)
            const appsUserCanEdit = await getOrganisationAppsByUserId(
                currentUser.id,
                db
            )
            isDeveloper =
                appsUserCanEdit.map((app) => app.app_id).indexOf(appId) !== -1
        } catch (err) {
            //no user on request
            debug('No user in request')
        }

        if (canSeeAllApps(request) || isDeveloper) {
            if (isDeveloper) {
                debug('user is a developer with access to this app')
            } else {
                debug('Can see all apps, fetch it no matter its status')
            }
            apps = await getAppsById(appId, 'en', db)
        } else {
            debug('Can NOT see all apps, fetch it only if approved')
            apps = await getAppsByIdAndStatus(
                appId,
                AppStatus.APPROVED,
                'en',
                db
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

        const result = v1FormattedArray[0]
        result.userCanEditApp = isDeveloper
        return result
    },
}
