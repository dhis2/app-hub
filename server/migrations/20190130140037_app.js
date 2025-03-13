const { AppStatus, AppType } = require('../src/enums')

exports.up = async (knex) => {
    await knex.schema.createTable('app', (table) => {
        table.uuid('id').primary()

        table.enu('type', [
            AppType.APP,
            AppType.DASHBOARD_WIDGET,
            AppType.TRACKER_DASHBOARD_WIDGET,
        ])

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.timestamp('updated_at', true)

        table.uuid('created_by_user_id').notNullable()

        table.uuid('developer_user_id').notNullable()

        table.uuid('updated_by_user_id')

        table.uuid('organisation_id').notNullable()

        table
            .foreign('organisation_id')
            .references('id')
            .inTable('organisation')

        table.foreign('developer_user_id').references('id').inTable('users')

        table.foreign('created_by_user_id').references('id').inTable('users')

        table.foreign('updated_by_user_id').references('id').inTable('users')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('app')
}
