const uuid = require('uuid/v4')

exports.seed = async knex => {
    //Developers
    await knex('user').del()
    await knex('user').insert([
        { id: 1, uuid: uuid(), email: 'erik@dhis2.org' },
        { id: 2, uuid: uuid(), email: 'viktor@dhis2.org' },
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

        { organisation_id: 1, user_id: 1 },
        { organisation_id: 2, user_id: 1 },
    ])
}
