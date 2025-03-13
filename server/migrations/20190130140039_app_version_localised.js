const { AppStatus, AppType } = require('../src/enums')

exports.up = async (knex) => {
    await knex.schema.createTable('app_version_localised', (table) => {
        table.uuid('id').primary()

        table.uuid('app_version_id')

        table
            .foreign('app_version_id')
            .references('id')
            .inTable('app_version')
            .onDelete('CASCADE')

        table.string('language_code', 2)

        table.string('name', 100).notNullable()

        table.text('description')

        table.string('slug', 100).notNullable()

        //One version can only have the same language once.
        table.unique(['app_version_id', 'language_code'])

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.uuid('created_by_user_id').notNullable()

        table.foreign('created_by_user_id').references('id').inTable('users')

        table.timestamp('updated_at', true).defaultTo(knex.fn.now())

        table.uuid('updated_by_user_id')

        table.foreign('updated_by_user_id').references('id').inTable('users')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('app_version_localised')
}
