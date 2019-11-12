const joi = require('@hapi/joi')

const debug = require('debug')('appstore:server:routes:apps:getAllApprovedApps')

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

        //default to Stable if not specified. Or undefined if we want to fetch all channels
        const channel =
            request.query.channel === 'All'
                ? undefined
                : request.query.channel || 'Stable'

        const dhis2Version = request.query.dhis2Version || null

        debug(`Filtering by channel: '${channel}'`)
        debug(`Filtering by dhis2Version: '${dhis2Version}'`)

        const appsQuery = getApps(
            {
                status: AppStatus.APPROVED,
                languageCode: 'en',
                channel,
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
