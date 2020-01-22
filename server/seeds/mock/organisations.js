const slugify = require('slugify')

const users = require('./users')

module.exports = [
    {
        id: 'cedb4418-2417-4e72-bfcc-35ccd0dc3e41',
        name: 'DHIS2',
        slug: slugify('DHIS2', { lower: true }),
        created_by_user_id: users[0].id,
    },
    {
        id: '73dd7dd0-3dbb-4687-b8af-194c5c7be572',
        name: 'World Health Organization',
        slug: slugify('World Health Organization', { lower: true }),
        created_by_user_id: users[1].id,
    },
]
