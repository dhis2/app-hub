const { AppStatus } = require('../src/enums')

const apps = require('./mock/apps')
const appVersions = require('./mock/appversions')
const appVersionsLocalised = require('./mock/appversions_localized')

const { flatten } = require('../src/utils')

exports.seed = async knex => {
    console.log('Seeding apps')

    await knex('app').del()
    await knex('app').insert(apps)

    console.log('Seeding app statuses')

    await knex('app_status').del()
    await knex('app_status').insert([
        {
            app_id: 1,
            status: AppStatus.APPROVED,
            created_by_user_id: 1,
        },
        {
            app_id: 2,
            status: AppStatus.APPROVED,
            created_by_user_id: 1,
        },
        {
            app_id: 3,
            status: AppStatus.PENDING,
            created_by_user_id: 1,
        },
        {
            app_id: 4,
            status: AppStatus.NOT_APPROVED,
            created_by_user_id: 1,
        },
    ])

    await knex('app_version_localised').del()
    await knex('app_version').del()

    console.log('Seeding appversions')

    await knex('app_version').insert(flatten(appVersions))

    await knex('app_version_localised').insert(flatten(appVersionsLocalised))
}
