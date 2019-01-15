
exports.up = async function(knex, Promise) {
    // create the organisation table
    const org = await knex.schema.createTable('organisations', t => {
        t.increments('organisation_id').unsigned().primary()
        t.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()'))
        t.string('name').unique()
        t.string('address')
    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('organisations')
};
