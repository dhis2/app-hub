const { AppStatus, AppType } = require('../src/enums')

exports.up = async knex => {
    await knex.schema.createTable('app', table => {
        table
            .increments('id')
            .unsigned()
            .primary()

        table
            .uuid('uuid')
            .unique()
            .notNullable()

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

        table
            .integer('created_by_user_id')
            .unsigned()
            .notNullable()

        table
            .integer('developer_user_id')
            .unsigned()
            .notNullable()

        table.integer('updated_by_user_id').unsigned()

        table
            .integer('organisation_id')
            .unsigned()
            .notNullable()

        table
            .foreign('organisation_id')
            .references('id')
            .inTable('organisation')

        table
            .foreign('developer_user_id')
            .references('id')
            .inTable('users')

        table
            .foreign('created_by_user_id')
            .references('id')
            .inTable('users')

        table
            .foreign('updated_by_user_id')
            .references('id')
            .inTable('users')
    })
}

exports.down = async knex => {
    await knex.schema.dropTable('app')
}
