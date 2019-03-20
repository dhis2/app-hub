exports.up = async (knex) => {

    await knex.schema.createTable('users', (table) => {

        table
            .increments('id')
            .unsigned()
            .primary()
        table
            .uuid('uuid')
            .unique()
            .notNullable()
        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()
        table.timestamp('updated_at', true)
        table.string('email', 255).unique()
        table.string('oauth').nullable()
        table.string('first_name', 100)
        table.string('last_name', 100)
    })
}

exports.down = async (knex) => {

    await knex.schema.dropTable('users')
}
