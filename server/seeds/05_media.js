const appVersions = require('./mock/appversions')
const { MediaType } = require('../src/enums')

const mimeTypes = require('./mock/mime_type')
const users = require('./mock/users')

const mediaTypeSeedData = require('./mock/mime_type')

exports.seed = async (knex) => {
    console.log('Seeding media')

    const mediaIds = [
        'e2b87e16-6bd9-4573-8bc5-015749051785',
        'c8a5cf2f-12d5-4bab-8899-f2438c043dec',
        'c306f3aa-4323-43f3-9f15-3a5d8506224b',
        'ede2e975-3771-4014-9d33-304831302afb',
    ]

    await knex('media').del()
    await knex('mime_type').del()
    await knex('mime_type').insert(mediaTypeSeedData)

    await knex('media').insert([
        {
            id: mediaIds[0],
            original_filename: `the_logo.png`,
            mime_type_id: mimeTypes[0].id,
            created_by_user_id: users[0].id,
        },
        {
            id: mediaIds[1],
            original_filename: `a_screenshot.jpg`,
            mime_type_id: mimeTypes[1].id,
            created_by_user_id: users[0].id,
        },
        {
            id: mediaIds[2],
            original_filename: `the_logo2.png`,
            mime_type_id: mimeTypes[0].id,
            created_by_user_id: users[0].id,
        },
        {
            id: mediaIds[3],
            original_filename: `a_screenshot2.jpg`,
            mime_type_id: mimeTypes[1].id,
            created_by_user_id: users[0].id,
        },
    ])

    const tableName = 'app_media'

    const seedData = [
        {
            app_id: appVersions[0][0].app_id,
            media_id: mediaIds[0],
            media_type: MediaType.Logo,
            created_by_user_id: appVersions[0][0].created_by_user_id,
        },
        {
            app_id: appVersions[0][0].app_id,
            media_id: mediaIds[1],
            media_type: MediaType.Screenshot,
            created_by_user_id: appVersions[0][0].created_by_user_id,
        },
        {
            app_id: appVersions[1][0].app_id,
            media_id: mediaIds[2],
            media_type: MediaType.Logo,
            created_by_user_id: appVersions[1][0].created_by_user_id,
        },
        {
            app_id: appVersions[1][0].app_id,
            media_id: mediaIds[3],
            media_type: MediaType.Screenshot,
            created_by_user_id: appVersions[1][0].created_by_user_id,
        },
    ]

    await knex(tableName).del()

    await knex(tableName).insert(seedData)
}
