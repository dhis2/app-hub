const AppModel = require('../../models/v1/out/App')
const { AppStatus } = require('../../enums')
const { getApps } = require('../../data')
const { convertAppsToApiV1Format } = require('../v1/apps/formatting')
const { filterAppsBySpecificDhis2Version } = require('../../utils/filters')

module.exports = [
    {
        method: 'GET',
        path: '/v2/apps',
        config: {
            auth: false,
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            let channels = ['Stable']
            if (request.query.channels) {
                channels = request.query.channels
                    .split(',')
                    .filter(channel => channel !== 'All')
            }

            let types = []
            if (request.query.types) {
                types = request.query.types.split(',')
            }

            const apps = await getApps(
                {
                    status: AppStatus.APPROVED,
                    languageCode: 'en',
                    channels,
                    types,
                    query: request.query.query,
                },
                h.context.db
            )
            const filteredApps = filterAppsBySpecificDhis2Version(
                apps,
                request.query.dhis_version
            )
            return h.paginate(
                'apps',
                convertAppsToApiV1Format(filteredApps, request)
            )
        },
    },
]
