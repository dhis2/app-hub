const Joi = require('@hapi/joi')
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
            response: {
                schema: Joi.object({
                    apps: Joi.array().items(AppModel.def),
                    pager: Joi.object({
                        page: Joi.number(),
                        pageCount: Joi.number(),
                        total: Joi.number(),
                        pageSize: Joi.number(),
                    }),
                }),
            },
        },
        handler: async (request, h) => {
            let channels = ['Stable']
            if (request.query.channels) {
                channels = request.query.channels
                    .split(',')
                    .filter(channel => channel !== 'All')
            }

            const { data: apps, pagination } = await getApps(
                {
                    status: AppStatus.APPROVED,
                    languageCode: 'en',
                    channels,
                    query: request.query.query,
                    page: request.query.page,
                },
                h.context.db
            )

            const filteredApps = filterAppsBySpecificDhis2Version(
                apps,
                request.query.dhis_version
            )

            return {
                apps: convertAppsToApiV1Format(filteredApps, request),
                pager: {
                    page: pagination.currentPage,
                    pageCount: pagination.lastPage,
                    total: pagination.total,
                    pageSize: pagination.perPage,
                },
            }
        },
    },
]
