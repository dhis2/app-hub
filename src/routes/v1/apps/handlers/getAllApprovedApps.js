const joi = require('@hapi/joi')
const semver = require('semver')

const debug = require('debug')('appstore:server:routes:apps:getAllApprovedApps')

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

        //default to Stable if not specified. Or undefined if we want to fetch all channels
        const channel =
            request.query.channel === 'All'
                ? undefined
                : request.query.channel || 'Stable'

        const dhis2Version = request.query.dhis2Version || null

        debug(`Using channel: '${channel}'`)
        debug(`Using dhis2Version: '${dhis2Version}'`)

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
        let filteredApps = null

        if (dhis2Version) {
            filteredApps = []

            const dhis2Semver = semver.coerce(dhis2Version)
            debug('dhis2Semver', dhis2Semver)

            for (let i = 0, n = apps.length; i < n; ++i) {
                const appRow = apps[i]

                const maxVersion = semver.coerce(appRow.max_dhis2_version)
                debug('maxVersion', maxVersion)

                const maxVersionValid = semver.valid(maxVersion)
                debug('maxVersionValid', maxVersionValid)

                const minVersion = semver.coerce(appRow.min_dhis2_version)
                debug('minVersion', minVersion)

                if (
                    (maxVersionValid &&
                        semver.satisfies(
                            dhis2Semver.version,
                            `${minVersion.version} - ${maxVersion.version}`
                        )) ||
                    (!maxVersionValid &&
                        semver.satisfies(
                            dhis2Semver.version,
                            `>= ${minVersion.version}`
                        ))
                ) {
                    filteredApps.push(appRow)
                }
            }
        } else {
            filteredApps = apps
        }

        return convertAppsToApiV1Format(filteredApps, request)
    },
}
