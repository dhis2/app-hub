const uuid = require('uuid/v4')
const slugify = require('slugify')

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

exports.seed = async knex => {
    console.log('Starting seeding data')
    console.log(knex.client.config)

    await knex('user_organisation').del()
    await knex('user_external_id').del()
    await knex('users').del()
    await knex('organisation').del()

    console.log('Inserting users')

    //Developers
    await knex('users').insert([
        {
            id: 1,
            uuid: '58262f57-4f38-45c5-a3c2-9e30ab3ba2da',
            email: 'apphub-api@dhis2.org',
            name: 'Mr Jenkins',
        },
        {
            id: 2,
            uuid: 'd30bfdae-ac6e-4ed4-8b2c-3cd1787922f4',
            email: 'erik@dhis2.org',
            name: 'Erik Arenhill',
        },
        {
            id: 3,
            uuid: '71bced64-c7f7-4b70-aa09-9b8d1e59ed49',
            email: 'viktor@dhis2.org',
            name: 'Viktor Varland',
        },
    ])

    console.log('Inserting user_external_id')
    if (!process.env.AUTH0_AUDIENCE) {
        console.warn(
            'WARNING: process.env.AUTH0_AUDIENCE is not set. Will not insert external id for M2M Api access (this requires manual setup)'
        )
    } else {
        await knex('user_external_id').insert([
            {
                id: 1,
                user_id: 1,
                external_id: `${process.env.AUTH0_AUDIENCE}@clients`,
            },
        ])
    }

    console.log('Inserting organisations')

    //Organisations
    await knex('organisation').insert([
        {
            id: 1,
            uuid: uuid(),
            name: 'DHIS2',
            slug: slugify('DHIS2', { lower: true }),
            created_by_user_id: 1,
        },
        {
            id: 2,
            uuid: uuid(),
            name: 'World Health Organization',
            slug: slugify('World Health Organization', { lower: true }),
            created_by_user_id: 1,
        },
    ])

    console.log('Inserting user-organisations #01')
    //user-organisations
    await knex('user_organisation').insert([
        { organisation_id: 1, user_id: 3 }, //viktor -> dhis2
        { organisation_id: 2, user_id: 2 }, //erik -> who
    ])

    console.log('Inserting user-organisations #02')

    //to get another timestamp
    await sleep(500)
    await knex('user_organisation').insert([
        { organisation_id: 1, user_id: 1 }, //apphub -> dhis2
    ])
}
