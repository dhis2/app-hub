exports.up = async knex => {
    await knex.schema.createTable('app_version_media', table => {
        table
            .increments('id')
            .unsigned()
            .primary()

        table
            .uuid('uuid')
            .unique()
            .notNullable()

        table
            .integer('image_type')
            .unsigned()
            .notNullable()

        table.string('original_filename', 255).notNullable()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table
            .integer('created_by_user_id')
            .unsigned()
            .notNullable()

        table
            .integer('media_type_id')
            .unsigned()
            .notNullable()

        table
            .foreign('media_type_id')
            .references('id')
            .inTable('media_type')

        table
            .integer('app_version_id')
            .unsigned()
            .notNullable()

        table
            .foreign('app_version_id')
            .references('id')
            .inTable('app_version')
            .onDelete('CASCADE')
    })
}

exports.down = async knex => {
    await knex.schema.dropTable('app_version_media')
}
