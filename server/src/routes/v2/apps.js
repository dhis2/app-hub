const Joi = require('@hapi/joi')
const AppModel = require('../../models/v1/out/App')
const { AppStatus } = require('../../enums')
const { getApps } = require('../../data')
const { convertAppsToApiV1Format } = require('../v1/apps/formatting')
const { filterAppsBySpecificDhis2Version } = require('../../utils/filters')
const CustomJoi = require('../../utils/CustomJoi')

const CHANNELS = ['Stable', 'Development', 'Canary']
const APPTYPES = ['APP', 'DASHBOARD_WIDGET', 'TRACKER_DASHBOARD_WIDGET']

const StringArrayJoi = Joi.extend({
    base: Joi.array(),
    type: 'stringArray',
    coerce: (value, state, options) => ({
        value: value.split ? value.split(',') : value
    })
})

module.exports = [
    {
        method: 'GET',
        path: '/v2/apps',
        config: {
            auth: false,
            tags: ['api', 'v2'],
            validate: {
                query: Joi.object({
                    channels: CustomJoi.filter(
                        StringArrayJoi.stringArray().items(Joi.valid(...CHANNELS))
                    ).description(
                        'Filter by channel'
                    ).default(['Stable']),
                    types: CustomJoi.filter(
                        StringArrayJoi.stringArray().items(Joi.valid(...APPTYPES))
                    ).description(
                        'Filter by app type'
                    ).default(['APP']),
                }).unknown(true),
            },
            plugins: {
                queryFilter: {
                    enabled: true
                },
                pagination: {
                    enabled: true,
                },
            },
        },
        handler: async (request, h) => {
            const channels = request.plugins.queryFilter.getFilter('channels').value
            const types = request.plugins.queryFilter.getFilter('types').value

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
            const pager = request.plugins.pagination
            const result = convertAppsToApiV1Format(filteredApps, request)
            return h.paginate(pager, {
                result,
                total: result.length
            })
        },
    },
]
