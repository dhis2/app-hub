const uuid = require('uuid/v4')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

exports.seed = async knex => {
    //Developers
    await knex('user').del()
    await knex('user').insert([
        { id: 1, uuid: 'd30bfdae-ac6e-4ed4-8b2c-3cd1787922f4', email: 'erik@dhis2.org', first_name: 'Erik', last_name: 'Arenhill' },
        { id: 2, uuid: '71bced64-c7f7-4b70-aa09-9b8d1e59ed49', email: 'viktor@dhis2.org', first_name: 'Viktor', last_name: 'Varland' },
    ])

    //Organisations
    await knex('organisation').del()
    await knex('organisation').insert([
        { id: 1, uuid: uuid(), name: 'DHIS2' },
        { id: 2, uuid: uuid(), name: 'WHO' },
    ])

    //user-organisations
    await knex('user_organisation').del()
    await knex('user_organisation').insert([
        { organisation_id: 1, user_id: 2 },

        { organisation_id: 2, user_id: 1 },
    ])

    //to get another timestamp
    await sleep(500)
    await knex('user_organisation').insert([
        { organisation_id: 1, user_id: 1 }
    ])
}
