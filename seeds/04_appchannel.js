const uuid = require('uuid/v4')
const appVersions = require('./mock/appversions')

const [
    dhis2AppVersions,
    whoAppVersions,
    pendingAppVersions,
    rejectedAppVersions,
] = appVersions

exports.seed = async knex => {
    console.log('Seeding channels')

    await knex('app_channel').del()

    await knex('channel').del()
    await knex('channel').insert([
        { id: 1, name: 'Stable', uuid: uuid() },
        { id: 2, name: 'Development', uuid: uuid() },
        { id: 3, name: 'Canary', uuid: uuid() },
    ])

    await knex('app_channel').insert([
        {
            app_version_id: dhis2AppVersions[0].id,
            channel_id: 1,
            min_dhis2_version: '2.28',
            created_by_user_id: dhis2AppVersions[0].created_by_user_id,
        },
        {
            app_version_id: dhis2AppVersions[1].id,
            channel_id: 2,
            min_dhis2_version: '2.29',
            created_by_user_id: dhis2AppVersions[1].created_by_user_id,
        },
        {
            app_version_id: dhis2AppVersions[2].id,
            channel_id: 3,
            min_dhis2_version: '2.32',
            created_by_user_id: dhis2AppVersions[2].created_by_user_id,
        },

        {
            app_version_id: whoAppVersions[0].id,
            channel_id: 1,
            min_dhis2_version: '2.27',
            created_by_user_id: whoAppVersions[0].created_by_user_id,
        },
        {
            app_version_id: whoAppVersions[1].id,
            channel_id: 2,
            min_dhis2_version: '2.29',
            created_by_user_id: whoAppVersions[1].created_by_user_id,
        },
        {
            app_version_id: whoAppVersions[2].id,
            channel_id: 3,
            min_dhis2_version: '2.29',
            created_by_user_id: whoAppVersions[2].created_by_user_id,
        },

        {
            app_version_id: pendingAppVersions[0].id,
            channel_id: 1,
            min_dhis2_version: '2.30',
            created_by_user_id: pendingAppVersions[0].created_by_user_id,
        },
        {
            app_version_id: rejectedAppVersions[0].id,
            channel_id: 1,
            min_dhis2_version: '2.30',
            created_by_user_id: rejectedAppVersions[0].created_by_user_id,
        },
    ])
}
