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
            knex.ref('app_version.source_url'),
            knex.ref('app_version.demo_url'),
            knex.ref('channel.name').as('channel'),
            knex.ref('ac.min_dhis2_version'),
            knex.ref('ac.max_dhis2_version')
        )

//const find = async ({ filters, pager }, knex) => {}

async function findByAppId(appId, { filters, pager }, knex) {
    // console.log('thiz2', this)
    const query = getAppVersionQuery(knex).where('app_version.app_id', appId)
    return executeQuery(query, { filters, pager, model: AppVersionModel })
}

const appendNamespace = name => 'services.appVersion.'.concat(name)

// this can be used by hapi server.method for caching
const methods = [
    {
        name: appendNamespace('findByAppId'),
        method: findByAppId,
        options: {
            cache: {
                //cache: 'appVersion',
                expiresIn: 10 * 1000,
                generateTimeout: 2000,
                getDecoratedValue: true,
            },
            generateKey: appId => appId,
        },
    },
]

module.exports = {
    findByAppId,
    methods,
}
