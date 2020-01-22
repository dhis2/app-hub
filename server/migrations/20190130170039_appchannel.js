exports.up = async knex => {
    await knex.schema.createTable('channel', table => {
        table.uuid('id').primary()

        table
            .string('name', 50)
            .unique()
            .notNullable()
    })

    await knex.schema.createTable('app_channel', table => {
        table.uuid('id').primary()

        table
            .uuid('app_version_id')
            .unsigned()
            .notNullable()

        table
            .uuid('channel_id')
            .unsigned()
            .notNullable()

        table
            .string('min_dhis2_version', 10)
            .notNullable()
            .index()

        table.string('max_dhis2_version', 10).index()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table
            .uuid('created_by_user_id')
            .unsigned()
            .notNullable()

        table
            .foreign('created_by_user_id')
            .references('id')
            .inTable('users')

        table
            .foreign('channel_id')
            .references('id')
            .inTable('channel')

        table
            .timestamp('updated_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.uuid('updated_by_user_id').unsigned()

        table
            .foreign('updated_by_user_id')
            .references('id')
            .inTable('users')
    })
}

exports.down = async knex => {
    await knex.schema.dropTable('app_channel')
    await knex.schema.dropTable('channel')
}
