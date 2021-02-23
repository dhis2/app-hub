const joi = require('@hapi/joi')

const debug = require('debug')('apphub:server:routes:apps:getAllApprovedApps')

const AppModel = require('../../../../models/v1/out/App')

const { AppStatus } = require('../../../../enums')

const { getApps } = require('../../../../data')
const { convertAppsToApiV1Format } = require('../formatting')

const {
    filterAppsBySpecificDhis2Version,
} = require('../../../../utils/filters')

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

        //default to stable if not specified. Or empty list if we want to fetch all channels
        const channels =
            request.query.channel === 'All'
                ? []
                : [request.query.channel || 'stable']

        const dhis2Version = request.query.dhis_version || null

        debug(`Filtering by channel: '${channels[0]}'`)
        debug(`Filtering by dhis2Version: '${dhis2Version}'`)

        const appsQuery = getApps(
            {
                status: AppStatus.APPROVED,
                languageCode: 'en',
                channels,
            },
            h.context.db
        )

        debug(appsQuery.toString())
        const apps = await appsQuery

        const filteredApps = filterAppsBySpecificDhis2Version(
            apps,
            dhis2Version
        )

        return convertAppsToApiV1Format(filteredApps, request)
    },
}
