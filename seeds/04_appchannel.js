const uuid = require('uuid/v4')
const appVersions = require('./mock/appversions')

const [
    dhis2AppVersions,
    whoAppVersions,
    pendingAppVersions,
    rejectedAppVersions,
    betaOnlyTrackerWidgetVersions,
    canaryOnlyDashboardWidgetVersions,
] = appVersions

exports.seed = async knex => {
    console.log('Seeding channels')

    await knex('app_channel').del()

    const stableId = '1b47bbd6-fbcd-4694-af1c-2f1b23ff940c'
    const developmentId = 'e12d8d24-728b-40df-8fd2-0a6b2ff9becb'
    const canaryId = '83cd652a-b5e6-4420-8413-209c6ab7113a'

    await knex('channel').del()
    await knex('channel').insert([
        { id: stableId, name: 'Stable' },
        { id: developmentId, name: 'Development' },
        { id: canaryId, name: 'Canary' },
    ])

    await knex('app_channel').insert([
        {
            app_version_id: dhis2AppVersions[0].id,
            channel_id: stableId,
            min_dhis2_version: '2.28',
            created_by_user_id: dhis2AppVersions[0].created_by_user_id,
        },
        {
            app_version_id: dhis2AppVersions[1].id,
            channel_id: developmentId,
            min_dhis2_version: '2.29',
            created_by_user_id: dhis2AppVersions[1].created_by_user_id,
        },
        {
            app_version_id: dhis2AppVersions[2].id,
            channel_id: canaryId,
            min_dhis2_version: '2.32',
            created_by_user_id: dhis2AppVersions[2].created_by_user_id,
        },

        {
            app_version_id: whoAppVersions[0].id,
            channel_id: stableId,
            min_dhis2_version: '2.27',
            created_by_user_id: whoAppVersions[0].created_by_user_id,
        },
        {
            app_version_id: whoAppVersions[1].id,
            channel_id: developmentId,
            min_dhis2_version: '2.29',
            created_by_user_id: whoAppVersions[1].created_by_user_id,
        },
        {
            app_version_id: whoAppVersions[2].id,
            channel_id: canaryId,
            min_dhis2_version: '2.29',
            created_by_user_id: whoAppVersions[2].created_by_user_id,
        },

        {
            app_version_id: pendingAppVersions[0].id,
            channel_id: stableId,
            min_dhis2_version: '2.30',
            created_by_user_id: pendingAppVersions[0].created_by_user_id,
        },
        {
            app_version_id: rejectedAppVersions[0].id,
            channel_id: stableId,
            min_dhis2_version: '2.30',
            created_by_user_id: rejectedAppVersions[0].created_by_user_id,
        },

        {
            app_version_id: betaOnlyTrackerWidgetVersions[0].id,
            channel_id: developmentId,
            min_dhis2_version: '2.30',
            created_by_user_id:
                betaOnlyTrackerWidgetVersions[0].created_by_user_id,
        },
        {
            app_version_id: canaryOnlyDashboardWidgetVersions[0].id,
            channel_id: canaryId,
            min_dhis2_version: '2.30',
            created_by_user_id:
                canaryOnlyDashboardWidgetVersions[0].created_by_user_id,
        },
    ])
}
