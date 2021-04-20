exports.up = async knex => {
    await knex.schema.table('users', table => {
        table.dropUnique('email')
    })

    await knex.schema.table('app', table => {
        table.string('contact_email', 255)
    })

    // set contact-email to developer user-email
    await knex.raw(`
        UPDATE app a
        SET contact_email = u.email
        from users u
        where u.id = a.developer_user_id
    `)

    // remove developer-email, add owner-information
    await knex.raw('DROP VIEW apps_view')
    await knex.raw(`
        CREATE VIEW apps_view AS
        SELECT  app.id AS app_id,
                app.type,
                appver.version, appver.id AS version_id, appver.created_at AS version_created_at, appver.source_url, appver.demo_url,
                media.app_media_id AS media_id, media.original_filename, media.created_at AS media_created_at, media.media_type,
                localisedapp.language_code, localisedapp.name, localisedapp.description, localisedapp.slug AS appver_slug,
                s.status, s.created_at AS status_created_at,
                ac.min_dhis2_version, ac.max_dhis2_version,
                c.name AS channel_name, c.id AS channel_id,
                app.contact_email AS contact_email,
                users.id as owner_id, users.name as owner_name, users.email as owner_email,
                org.name AS organisation, org.slug AS organisation_slug, org.email as organisation_email

            FROM app

            INNER JOIN app_status AS s
                ON s.app_id = app.id

            INNER JOIN app_version AS appver
                ON appver.app_id = s.app_id

            LEFT JOIN app_media_view AS media
                ON media.app_id = s.app_id

            INNER JOIN app_version_localised AS localisedapp
                ON localisedapp.app_version_id = appver.id

            INNER JOIN app_channel AS ac
                ON ac.app_version_id = appver.id

            INNER JOIN channel AS c
                ON c.id = ac.channel_id

            INNER JOIN users
                ON users.id = app.created_by_user_id

            INNER JOIN organisation AS org
                ON org.id = app.organisation_id
    `)

    await knex.schema.table('app', table => {
        table.dropColumn('developer_user_id')
    })
}

exports.down = async knex => {
    await knex.raw('DROP VIEW apps_view')
    await knex.schema.table('users', table => {
        table.unique('email')
    })

    await knex.schema.table('app', table => {
        table.uuid('developer_user_id')
        table
            .foreign('developer_user_id')
            .references('id')
            .inTable('users')
    })

    await knex.raw(`
        UPDATE app a
        SET developer_user_id = u.id
        from users u
        where u.email = a.contact_email
    `)
    await knex.schema.table('app', table => {
        table.dropColumn('contact_email')
        table
            .uuid('developer_user_id')
            .notNullable()
            .alter()
    })

    await knex.raw(`
        CREATE VIEW apps_view AS
        SELECT  app.id AS app_id,
                app.type,
                appver.version, appver.id AS version_id, appver.created_at AS version_created_at, appver.source_url, appver.demo_url,
                media.app_media_id AS media_id, media.original_filename, media.created_at AS media_created_at, media.media_type,
                localisedapp.language_code, localisedapp.name, localisedapp.description, localisedapp.slug AS appver_slug,
                s.status, s.created_at AS status_created_at,
                ac.min_dhis2_version, ac.max_dhis2_version,
                c.name AS channel_name, c.id AS channel_id,
                users.id AS developer_id, users.name AS developer_name,
                users.email AS developer_email,
                org.name AS organisation, org.slug AS organisation_slug

            FROM app

            INNER JOIN app_status AS s
                ON s.app_id = app.id

            INNER JOIN app_version AS appver
                ON appver.app_id = s.app_id

            LEFT JOIN app_media_view AS media
                ON media.app_id = s.app_id

            INNER JOIN app_version_localised AS localisedapp
                ON localisedapp.app_version_id = appver.id

            INNER JOIN app_channel AS ac
                ON ac.app_version_id = appver.id

            INNER JOIN channel AS c
                ON c.id = ac.channel_id

            INNER JOIN users
                ON users.id = app.developer_user_id

            INNER JOIN organisation AS org
                ON org.id = app.
    `)
}
