exports.up = async knex => {
    await knex.schema.createTable('channel', table => {
        table
            .increments('id')
            .unsigned()
            .primary()

        table
            .uuid('uuid')
            .unique()
            .notNullable()

        table.string('name', 50).notNullable()
    })

    await knex.schema.createTable('app_channel', table => {
        table
            .increments('id')
            .unsigned()
            .primary()

        table
            .integer('app_version_id')
            .unsigned()
            .notNullable()

        table
            .integer('channel_id')
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
            .integer('created_by_user_id')
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
    })
}

exports.down = async knex => {
    await knex.schema.dropTable('app_channel')
    await knex.schema.dropTable('channel')
}
