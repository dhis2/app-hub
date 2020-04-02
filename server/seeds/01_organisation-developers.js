const users = require('./mock/users')
const organisations = require('./mock/organisations')

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

exports.seed = async knex => {
    console.log('Starting seeding data')
    console.log(knex.client.config)

    await knex('user_organisation').del()
    await knex('user_external_id').del()
    await knex('app').del()
    await knex('app_channel').del()
    await knex('organisation').del()
    await knex('users').del()

    console.log('Inserting users')

    //Developers
    await knex('users').insert(users)

    console.log('Inserting user_external_id')
    if (!process.env.AUTH0_AUDIENCE) {
        console.warn(
            'WARNING: process.env.AUTH0_AUDIENCE is not set. Will not insert external id for M2M Api access (this requires manual setup)'
        )
    } else {
        await knex('user_external_id').insert([
            {
                id: '46e00c3b-4668-4b93-bc6f-a46bc21f1e5d',
                user_id: users[0].id,
                external_id: `${process.env.AUTH0_AUDIENCE}@clients`,
            },
        ])
    }

    console.log('Inserting organisations')

    //Organisations
    await knex('organisation').insert(organisations)

    console.log('Inserting user-organisations #01')
    //user-organisations
    await knex('user_organisation').insert([
        { organisation_id: organisations[0].id, user_id: users[2].id }, //viktor -> dhis2
        { organisation_id: organisations[1].id, user_id: users[1].id }, //erik -> who
    ])

    console.log('Inserting user-organisations #02')

    //to get another timestamp
    await sleep(500)
    await knex('user_organisation').insert([
        { organisation_id: organisations[0].id, user_id: users[0].id }, //apphub-api -> dhis2
    ])
}
