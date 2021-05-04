const { AppStatus } = require('../src/enums')
const { flatten } = require('../src/utils')
const users = require('././mock/users')
const apps = require('./mock/apps')
const appVersions = require('./mock/appversions')
const appVersionsLocalised = require('./mock/appversions_localized')

const statuses = [
    {
        id: 'e900f977-9b5d-496d-9576-cc704359bde1',
        app_id: apps[0].id,
        status: AppStatus.APPROVED,
        created_by_user_id: users[1].id,
    },
    {
        id: '4cb8e2cc-5e92-4b7d-90c4-4ef96e1ea337',
        app_id: apps[1].id,
        status: AppStatus.APPROVED,
        created_by_user_id: users[0].id,
    },
    {
        id: '4a5c9b5d-6492-4789-8dde-65fca5e1afb5',
        app_id: apps[2].id,
        status: AppStatus.NOT_APPROVED,
        created_by_user_id: users[0].id,
    },
    {
        id: '58d36381-b73e-4cf1-85d3-908fcb0baea3',
        app_id: apps[3].id,
        status: AppStatus.PENDING,
        created_by_user_id: users[0].id,
    },
    {
        id: 'cf85df81-8a0b-4247-acd3-09a6a203d84f',
        app_id: apps[4].id, //beta/dev only app
        status: AppStatus.APPROVED,
        created_by_user_id: users[0].id,
    },
    {
        id: 'fc8e1bd0-2e66-4bf1-b644-231e85949e54',
        app_id: apps[5].id, //canary only app
        status: AppStatus.APPROVED,
        created_by_user_id: users[0].id,
    },
]

exports.seed = async knex => {
    console.log('Seeding apps')

    await knex('app').del()
    await knex('app').insert(apps)

    // console.log('Seeding app statuses:', statuses)

    await knex('app_status').del()
    await knex('app_status').insert(statuses)

    await knex('app_version_localised').del()
    await knex('app_version').del()

    console.log('Seeding appversions')

    // console.log(appVersions)
    await knex('app_version').insert(flatten(appVersions))

    // console.log(appVersionsLocalised)
    await knex('app_version_localised').insert(flatten(appVersionsLocalised))
}
