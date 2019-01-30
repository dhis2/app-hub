const { dhis2App, whoApp } = require('./mock/apps')
const { dhis2AppVersions, whoAppVersions } = require('./mock/appversions')

exports.seed = function(knex, Promise) {
    const reviews = [
        {
            id: 1,
            reviewtext: 'This is a really good app.',
            rating: 4,
            app_version_id: dhis2AppVersions[0].id,
        },
        {
            id: 2,
            reviewtext: 'This version is quite buggy.',
            rating: 2,
            app_version_id: dhis2AppVersions[1].id,
        },
        {
            id: 3,
            reviewtext: 'This version is working great again, good job team!',
            rating: 5,
            app_version_id: dhis2AppVersions[2].id,
        },

        {
            id: 4,
            reviewtext: 'This is a really good app.',
            rating: 4,
            app_version_id: whoAppVersions[0].id,
        },
        {
            id: 5,
            reviewtext: 'This version is VERY buggy.',
            rating: 2,
            app_version_id: whoAppVersions[1].id,
        },
        {
            id: 6,
            reviewtext: 'This version is working ok',
            rating: 3,
            app_version_id: whoAppVersions[2].id,
        },
    ]

    // Deletes ALL existing entries
    return knex('review')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('review').insert(reviews)
        })
}
