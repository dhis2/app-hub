
exports.up = async function(knex, Promise) {
    // create the developer table
    const dev = await knex.schema.createTable('developers', t => {
        t.increments('developer_id').unsigned().primary()
        t.integer('organisation').unsigned().nullable()

        t.uuid('uuid')
        t.string('name').notNullable()
        t.string('oauth').nullable()
        t.string('email').unique()

        t.foreign('organisation').references('organisation_id').inTable('organisations')
    })
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('developers')
};
