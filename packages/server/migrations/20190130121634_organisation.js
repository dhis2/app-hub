exports.up = async (knex) => {

    await knex.schema.createTable('organisation', (table) => {

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

        table
            .integer('created_by_user_id')
            .unsigned()
            .notNullable()

        table
            .foreign('created_by_user_id')
            .references('id')
            .inTable('users')

        table.timestamp('updated_at', true)

        table.string('name', 100).unique()

        table.string('slug', 100).unique()
    })
}

exports.down = async (knex) => {

    await knex.schema.dropTable('organisation')
}
