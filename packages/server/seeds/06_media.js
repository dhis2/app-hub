
const appVersions = require('./mock/appversions')
const uuid = require('uuid/v4')
const { MediaType } = require('@enums')
const { flatten } = require('../src/utils')

exports.seed = async (knex) => {

    const tableName = 'app_version_media'

    const appVersionMedias = flatten(appVersions).map((version) => {

        return [
            {
                app_version_id: version.id,
                uuid: uuid(),
                original_filename: `the_logo_${version.id}.png`,
                media_type: MediaType.Logo,
                content_type_id: 2,
                created_by_user_id: version.created_by_user_id
            },
            {
                app_version_id: version.id,
                uuid: uuid(),
                original_filename: `a_screenshot_${version.id}.jpg`,
                media_type: MediaType.Image,
                content_type_id: 1,
                created_by_user_id: version.created_by_user_id
            }
        ]
    })

    const seedData = flatten(appVersionMedias)

    await knex(tableName).del()

    await knex(tableName).insert(seedData)

}

