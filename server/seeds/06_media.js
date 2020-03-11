const appVersions = require('./mock/appversions')
const { ImageType } = require('../src/enums')
const { flatten } = require('../src/utils')

const mediaTypes = require('./mock/media_type')
const users = require('./mock/users')

exports.seed = async knex => {
    console.log('Seeding media')

    const mediaIds = [
        'e2b87e16-6bd9-4573-8bc5-015749051785',
        'c8a5cf2f-12d5-4bab-8899-f2438c043dec',
    ]

    await knex('media').del()
    await knex('media').insert([
        {
            id: mediaIds[0],
            original_filename: `the_logo.png`,
            media_type_id: mediaTypes[0].id,
            created_by_user_id: users[0].id,
        },
        {
            id: mediaIds[1],
            original_filename: `a_screenshot.jpg`,
            media_type_id: mediaTypes[1].id,
            created_by_user_id: users[0].id,
        },
    ])

    const tableName = 'app_version_media'

    const appVersionMedias = flatten(appVersions).map(version => {
        return [
            {
                app_version_id: version.id,
                media_id: mediaIds[0],
                image_type: ImageType.Logo,
                created_by_user_id: users[0].id,
            },
            {
                app_version_id: version.id,
                media_id: mediaIds[1],
                image_type: ImageType.Screenshot,
                created_by_user_id: users[0].id,
            },
        ]
    })

    const seedData = flatten(appVersionMedias)

    await knex(tableName).del()

    await knex(tableName).insert(seedData)
}
