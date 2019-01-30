const { AppStatus } = require('../src/enums')

const { dhis2App, whoApp } = require('./mock/apps')
const { dhis2AppVersions, whoAppVersions } = require('./mock/appversions')
const {
    dhis2AppVersionsLocalized,
    whoAppVersionsLocalized,
} = require('./mock/appversions_localized')

const { flatten } = require('../src/utils')

exports.seed = async knex => {
    await knex('app').del()
    await knex('app').insert([dhis2App, whoApp])

    await knex('app_status').del()
    await knex('app_status').insert([
        {
            app_id: dhis2App.id,
            status: AppStatus.NOT_APPROVED,
            created_by_user_id: 1,
        },
        {
            app_id: whoApp.id,
            status: AppStatus.APPROVED,
            created_by_user_id: 1,
        },
    ])

    await knex('app_version_localised').del()
    await knex('app_version').del()

    await knex('app_version').insert(
        flatten([dhis2AppVersions, whoAppVersions])
    )

    await knex('app_version_localised').insert(
        flatten([dhis2AppVersionsLocalized, whoAppVersionsLocalized])
    )
}
