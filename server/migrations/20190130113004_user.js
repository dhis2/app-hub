exports.up = async (knex) => {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.timestamp('updated_at', true)

        table.string('email', 255).unique()

        //table.string('oauth').nullable()
        table.string('name', 255)
    })

    await knex.schema.createTable('user_external_id', (table) => {
        table.uuid('id').primary()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.string('external_id', 100).unique()

        table.uuid('user_id').notNullable()

        table.foreign('user_id').references('id').inTable('users')

        table.timestamp('updated_at', true)
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('user_external_id')
    await knex.schema.dropTable('users')
}
