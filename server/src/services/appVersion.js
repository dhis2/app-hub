const Schmervice = require('@hapipal/schmervice')
const AppVersionModel = require('../models/v2/AppVersion')
const { executeQuery } = require('../query/executeQuery')

const getAppVersionQuery = knex =>
    knex('app_version')
        .innerJoin(
            knex.ref('app_version_localised').as('avl'),
            'avl.app_version_id',
            'app_version.id'
        )
        .innerJoin(
            knex.ref('app_channel').as('ac'),
            'ac.app_version_id',
            'app_version.id'
        )
        .innerJoin(knex.ref('channel'), 'ac.channel_id', 'channel.id')
        .select(
            'app_version.id',
            'app_version.version',
            knex.ref('app_version.app_id').as('appId'),
            knex.ref('app_version.created_at').as('createdAt'),
            knex.ref('app_version.updated_at').as('updatedAt'),
            knex.ref('app_version.source_url').as('sourceUrl'),
            knex.ref('app_version.demo_url').as('demoUrl'),
            knex.ref('channel.name').as('channel'),
            knex.ref('ac.min_dhis2_version').as('minDhisVersion'),
            knex.ref('ac.max_dhis2_version').as('maxDhisVersion')
        )
        .where('language_code', 'en') // only english is supported for now
        .orderBy('app_version.created_at', 'desc')

class AppVersionService extends Schmervice.Service {
    constructor(server, schmerviceOptions) {
        super(server, schmerviceOptions)
    }

    async findByAppId(appId, { filters, pager }, knex) {
        const query = getAppVersionQuery(knex).where(
            'app_version.app_id',
            appId
        )

        // needs to be manually applied due to different column-name
        if (filters.getFilter('channel')) {
            filters.applyOneToQuery(query, 'channel', {
                overrideColumnName: 'channel.name',
            })
        }

        // null-values are allowed for maxDhisVersion, so include these if filter is present
        if (filters.getFilter('maxDhisVersion')) {
            filters.applyVersionFilter(query, 'maxDhisVersion', {
                includeEmpty: true,
            })
        }

        if (filters.getFilter('minDhisVersion')) {
            filters.applyVersionFilter(query, 'minDhisVersion')
        }

        return executeQuery(query, {
            filters,
            pager,
            model: AppVersionModel,
        })
    }
}

const createAppVersionService = (server, schmerviceOptions) => {
    const service = Schmervice.withName(
        'appVersionService',
        new AppVersionService(server, schmerviceOptions)
    )

    return service
}

module.exports = {
    AppVersionService,
    createAppVersionService,
}
