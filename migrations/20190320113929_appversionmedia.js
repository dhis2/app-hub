exports.up = async knex => {
    await knex.schema.createTable('app_version_media', table => {
        table.uuid('id').primary()

        table
            .integer('image_type') //enum/integer from code so no uuid here
            .notNullable()

        table.string('original_filename', 255).notNullable()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.uuid('created_by_user_id').notNullable()

        table.uuid('media_type_id').notNullable()

        table
            .foreign('media_type_id')
            .references('id')
            .inTable('media_type')

        table.uuid('app_version_id').notNullable()

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
