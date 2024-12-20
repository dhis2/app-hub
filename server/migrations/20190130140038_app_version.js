const { AppStatus, AppType } = require('../src/enums')

exports.up = async (knex) => {
    await knex.schema.createTable('app_version', (table) => {
        table.uuid('id').primary()

        table.uuid('app_id').notNullable()

        table.string('version', 50).notNullable()

        table.unique(['app_id', 'version'])

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.timestamp('updated_at', true).defaultTo(knex.fn.now())

        table
            .foreign('app_id')
            .references('id')
            .inTable('app')
            .onDelete('CASCADE')

        table.uuid('created_by_user_id').notNullable()

        table.uuid('updated_by_user_id')

        table.string('source_url', 500)

        table.string('demo_url', 500)

        table.foreign('created_by_user_id').references('id').inTable('users')

        table.foreign('updated_by_user_id').references('id').inTable('users')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('app_version')
}
