exports.up = async (knex) => {
    await knex.raw('DROP VIEW apps_view')

    await knex.raw('ALTER TABLE media_type RENAME TO mime_type')

    //Create the new separate media table
    await knex.schema.createTable('media', (table) => {
        table.uuid('id').primary()

        table.string('original_filename', 255).notNullable()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.uuid('created_by_user_id').notNullable()

        table.uuid('mime_type_id').notNullable()

        table.string('caption', 255)
        table.string('description', 255)

        table.foreign('mime_type_id').references('id').inTable('mime_type')
    })

    //Link between app and media
    await knex.schema.createTable('app_media', (table) => {
        table.uuid('id').primary()

        table.uuid('media_id')

        table.foreign('media_id').references('id').inTable('media')

        table
            .integer('media_type') //enum/integer from code so no uuid here. Logo or Screenshot
            .notNullable()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.uuid('created_by_user_id').notNullable()

        table.uuid('app_id').notNullable()

        table
            .foreign('app_id')
            .references('id')
            .inTable('app')
            .onDelete('CASCADE')
    })

    //Set uuid4 auto on primary keys
    await knex.raw(`
         ALTER TABLE app_media ALTER COLUMN id SET DEFAULT uuid_generate_v4();
         ALTER TABLE media ALTER COLUMN id SET DEFAULT uuid_generate_v4();
    `)

    //copy over media data from the old table to the new separate media table
    await knex.raw(
        `INSERT INTO media(id, original_filename, mime_type_id, created_by_user_id, created_at) 
         SELECT id, original_filename, media_type_id, created_by_user_id, created_at FROM app_version_media
        `
    )

    //link app and media and type (logo/screenshot)
    await knex.raw(
        `INSERT INTO app_media(media_id, app_id, created_by_user_id, media_type)
         SELECT oavm.id AS media_id, app_id, oavm.created_by_user_id, oavm.image_type FROM app_version_media AS oavm
         INNER JOIN app_version ON app_version.id = oavm.app_version_id `
    )
    await knex.raw('DROP TABLE app_version_media')

    //Create a view to make it easier querying for media for a specific app
    await knex.raw(`
        CREATE VIEW app_media_view AS
            SELECT app.id AS app_id, media.id AS media_id, app_media.media_type, app_media.id AS app_media_id, 
            media.mime_type_id, media.original_filename, media.created_at, media.created_by_user_id, 
            mime_type.mime 

            FROM media 

            INNER JOIN 
                app_media 
                ON app_media.media_id = media.id

            INNER JOIN
                app
                ON app_media.app_id = app.id

            INNER JOIN
                mime_type
                ON media.mime_type_id = mime_type.id
    `)

    //Recreate the apps_view view using the media view above
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
                    ON org.id = app.organisation_id
    `)
}

exports.down = async (knex) => {
    await knex.raw('ALTER TABLE mime_type RENAME TO media_type')

    //create a new app_version_media table to match the previous version
    await knex.schema.createTable('app_version_media', (table) => {
        table.uuid('id').primary()

        table
            .integer('image_type') //enum/integer from code so no uuid here
            .notNullable()

        table.string('original_filename', 255).notNullable()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.string('caption', 255)
        table.string('description', 255)

        table.uuid('created_by_user_id').notNullable()

        table.uuid('media_type_id').notNullable()

        table.foreign('media_type_id').references('id').inTable('media_type')

        table.uuid('app_version_id').notNullable()

        table
            .foreign('app_version_id')
            .references('id')
            .inTable('app_version')
            .onDelete('CASCADE')
    })

    await knex.raw(
        `ALTER TABLE app_version_media ALTER COLUMN id SET DEFAULT uuid_generate_v4();`
    )

    //Copy over data
    const appMedias = await knex('app_media_view')
    for (let i = 0, n = appMedias.length; i < n; ++i) {
        //attach the media to the last added version, assume that is ok.
        const appMedia = appMedias[i]
        const latestAppVersion = await knex('app_version')
            .where('app_id', appMedia.app_id)
            .orderBy('created_at', 'desc')
            .first('id')

        const {
            original_filename,
            media_id,
            mime_type_id,
            media_type,
            created_at,
            created_by_user_id,
        } = appMedia

        await knex('app_version_media').insert({
            id: media_id,
            app_version_id: latestAppVersion.id,
            original_filename,
            media_type_id: mime_type_id,
            image_type: media_type,
            created_at,
            created_by_user_id,
        })
    }

    //Drop views and tables
    await knex.raw('DROP VIEW apps_view')
    await knex.raw('DROP VIEW app_media_view')

    await knex.schema.dropTable('app_media')
    await knex.schema.dropTable('media')

    //Recreate the previous apps_view
    await knex.raw(`
        CREATE VIEW apps_view AS
            SELECT  app.id AS app_id, 
                    app.type,
                    appver.version, appver.id AS version_id, appver.created_at AS version_created_at, appver.source_url, appver.demo_url,
                    media.id AS media_id, media.original_filename, media.created_at AS media_created_at, media.image_type, media.caption AS media_caption, media.description AS media_description, 
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

                LEFT JOIN app_version_media AS media 
                    ON media.app_version_id = appver.id 

                INNER JOIN app_version_localised AS localisedapp
                    ON localisedapp.app_version_id = appver.id

                INNER JOIN app_channel AS ac
                    ON ac.app_version_id = appver.id

                INNER JOIN channel AS c 
                    ON c.id = ac.channel_id

                INNER JOIN users
                    ON users.id = app.developer_user_id

                INNER JOIN organisation AS org 
                    ON org.id = app.organisation_id
    `)
}
