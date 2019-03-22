const apps = require('./mock/apps')
const appVersions = require('./mock/appversions')
const uuid = require('uuid/v4')

const [ dhis2AppVersions, whoAppVersions ] = appVersions;

exports.seed = async (knex) => {

    console.log('Seeding reviews')

    const reviews = [
        {
            id: 1,
            reviewtext: 'This is a really good app.',
            rating: 4,
            app_version_id: dhis2AppVersions[0].id,
            uuid: uuid(),
        },
        {
            id: 2,
            reviewtext: 'This version is quite buggy.',
            rating: 2,
            app_version_id: dhis2AppVersions[1].id,
            uuid: uuid(),
        },
        {
            id: 3,
            reviewtext: 'This version is working great again, good job team!',
            rating: 5,
            app_version_id: dhis2AppVersions[2].id,
            uuid: uuid(),
        },

        {
            id: 4,
            reviewtext: 'This is a really good app.',
            rating: 4,
            app_version_id: whoAppVersions[0].id,
            uuid: uuid(),
        },
        {
            id: 5,
            reviewtext: 'This version is VERY buggy.',
            rating: 2,
            app_version_id: whoAppVersions[1].id,
            uuid: uuid(),
        },
        {
            id: 6,
            reviewtext: 'This version is working ok',
            rating: 3,
            app_version_id: whoAppVersions[2].id,
            uuid: uuid(),
        },
    ]

    await knex('review').del()
    await knex('review').insert(reviews)
}
