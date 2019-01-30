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
            .inTable('user')
    })

    await knex.raw(`
        CREATE VIEW apps_view AS 
            SELECT app.id AS app_id, appver.version, localisedapp.language_code, localisedapp.name, localisedapp.description, app.uuid, app.type, s.status, c.name AS channel_name, c.uuid AS channel_uuid FROM app 
                INNER JOIN app_status AS s
                    ON app.id = s.app_id
                INNER JOIN app_version AS appver
                    ON app.id = appver.app_id 
                INNER JOIN app_version_localised AS localisedapp
                    ON appver.id = localisedapp.app_version_id 

                INNER JOIN app_channel AS ac
                    ON ac.id = appver.id
                INNER JOIN channel AS c 
                    ON ac.channel_id = c.id
    `)
}

exports.down = async knex => {
    await knex.raw('DROP VIEW apps_view')
    await knex.schema.dropTable('app_channel')
    await knex.schema.dropTable('channel')
}
