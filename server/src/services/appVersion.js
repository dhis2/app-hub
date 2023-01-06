const Schmervice = require('@hapipal/schmervice')
const AppVersionModel = require('../models/v2/AppVersion')
const { executeQuery } = require('../query/executeQuery')
const { getServerUrl } = require('../utils')

const getAppVersionQuery = (knex) =>
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
        .innerJoin(
            knex.ref('app_status').as('as'),
            'as.app_id',
            'app_version.app_id'
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
            knex.ref('ac.max_dhis2_version').as('maxDhisVersion'),
            knex.ref('avl.slug'),
            knex.ref('app_version.download_count').as('downloadCount'),
            knex.ref('as.status').as('status')
        )
        .where('language_code', 'en') // only english is supported for now
        .orderBy('app_version.created_at', 'desc')

class AppVersionService extends Schmervice.Service {
    constructor(server, schmerviceOptions) {
        super(server, schmerviceOptions)
    }

    async findOne(id, { filters }, knex) {
        const query = getAppVersionQuery(knex).where('app_version.id', id)

        const { result } = await executeQuery(query, {
            filters,
            model: AppVersionModel,
        })
        return result[0]
    }

    // async findOneByColumn(columnValue, { filters }, knex) {
    //     const query = getAppVersionQuery(knex).where(``)
    // }

    async findByAppId(appId, { filters, pager } = {}, knex) {
        const query = getAppVersionQuery(knex).where(
            'app_version.app_id',
            appId
        )

        if (filters) {
            // needs to be manually applied due to different column-name
            if (filters.getFilter('channel')) {
                filters.applyOneToQuery(query, 'channel', {
                    overrideColumnName: 'channel.name',
                })
            }
            // null-values are allowed for maxDhisVersion, so include these if filter is present
            filters.applyVersionFilter(query, 'maxDhisVersion', {
                includeEmpty: true,
            })

            filters.applyVersionFilter(query, 'minDhisVersion')
        }

        return executeQuery(query, {
            filters,
            pager,
            model: AppVersionModel,
        })
    }

    async getAvailableChannels(appId, knex) {
        const query = getAppVersionQuery(knex)
            .clear('select')
            .clear('order')
            .select('channel.name')
            .where('app_version.app_id', appId)
            .distinct()

        const { result } = await executeQuery(query)

        return result.map((c) => c.name)
    }

    getDownloadUrl(request, appVersion) {
        const { appId, slug, version } = appVersion
        const url = getServerUrl(request)

        return `${url}/v2/apps/${appId}/download/${slug}_${version}.zip`
    }

    /**
     * Helper method to set the downloadUrl of appversion
     * Curried to be used directly in .map()
     * @param {*} request to use to get the server-url
     * @returns a function with signature (appVersion) => appVersionWithDownloadUrl
     */
    createSetDownloadUrl(request) {
        return (appVersion) => {
            appVersion.downloadUrl = this.getDownloadUrl(request, appVersion)
            return appVersion
        }
    }

    async incrementDownloadCount(appVersionId, knex) {
        return knex('app_version')
            .increment('download_count', 1)
            .where('id', appVersionId)
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
