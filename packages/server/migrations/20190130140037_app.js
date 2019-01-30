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
            .foreign('created_by_user_id')
            .references('id')
            .inTable('user')

        table
            .foreign('updated_by_user_id')
            .references('id')
            .inTable('user')
    })

    await knex.schema.createTable('app_version', table => {
        table
            .increments('id')
            .unsigned()
            .primary()

        table
            .integer('app_id')
            .unsigned()
            .notNullable()

        table.string('version', 50).notNullable()

        table.unique(['app_id', 'version'])

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table
            .foreign('app_id')
            .references('id')
            .inTable('app')

        table
            .integer('created_by_user_id')
            .unsigned()
            .notNullable()

        table
            .foreign('created_by_user_id')
            .references('id')
            .inTable('user')
    })

    await knex.schema.createTable('app_version_localized', table => {
        table
            .increments('id')
            .unsigned()
            .primary()

        table.integer('app_version_id').unsigned()

        table
            .foreign('app_version_id')
            .references('id')
            .inTable('app_version')

        table.string('language_code', 2)

        //One version can only have the same language once.
        table.unique(['app_version_id', 'language_code'])

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
            .inTable('user')
    })

    await knex.schema.createTable('app_status', table => {
        table
            .increments('id')
            .unsigned()
            .primary()

        table
            .integer('app_id')
            .unsigned()
            .notNullable()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()
            .index()

        table
            .integer('created_by_user_id')
            .unsigned()
            .notNullable()

        table.enu('status', [
            AppStatus.PENDING,
            AppStatus.NOT_APPROVED,
            AppStatus.APPROVED,
        ])

        table
            .foreign('app_id')
            .references('id')
            .inTable('app')
            .onDelete('CASCADE')

        table
            .foreign('created_by_user_id')
            .references('id')
            .inTable('user')
    })

    await knex.raw(`
        CREATE VIEW apps_view AS 
            SELECT app.id AS app_id, app.uuid, app.type, s.status FROM app 
                INNER JOIN app_status AS s
                    ON app.id = s.app_id
                INNER JOIN app_version AS appver
                    ON app.id = appver.app_id 
    `)
}

exports.down = async knex => {
    await knex.raw('DROP VIEW apps_view')
    await knex.schema.dropTable('app_version_localized')
    await knex.schema.dropTable('app_version')
    await knex.schema.dropTable('app_status')
    await knex.schema.dropTable('app')
}
