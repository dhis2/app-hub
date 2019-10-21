const appVersions = require('./mock/appversions')
const uuid = require('uuid/v4')
const { ImageType } = require('../src/enums')
const { flatten } = require('../src/utils')

exports.seed = async knex => {
    console.log('Seeding media')

    const tableName = 'app_version_media'

    const appVersionMedias = flatten(appVersions).map(version => {
        return [
            {
                app_version_id: version.id,
                uuid: uuid(),
                original_filename: `the_logo_${version.id}.png`,
                image_type: ImageType.Logo,
                media_type_id: 2,
                created_by_user_id: version.created_by_user_id,
                caption: 'Logo',
                description: 'A really cool logo',
            },
            {
                app_version_id: version.id,
                uuid: uuid(),
                original_filename: `a_screenshot_${version.id}.jpg`,
                image_type: ImageType.Screenshot,
                media_type_id: 1,
                created_by_user_id: version.created_by_user_id,
                caption: 'A Screenshot',
                description: 'A screenshot of the app',
            },
        ]
    })

    const seedData = flatten(appVersionMedias)

    await knex(tableName).del()

    await knex(tableName).insert(seedData)
}
