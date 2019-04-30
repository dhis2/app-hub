exports.up = async knex => {
    await knex.raw(`
        CREATE VIEW apps_view AS 
            SELECT  app.id AS app_id, 
                    app.uuid, app.type,
                    appver.version, appver.id AS version_id, appver.uuid AS version_uuid, appver.created_at AS version_created_at, appver.source_url, appver.demo_url,
                    media.id AS media_id, media.original_filename, media.uuid AS media_uuid, media.created_at AS media_created_at, media.image_type,
                    localisedapp.language_code, localisedapp.name, localisedapp.description, localisedapp.slug AS appver_slug, 
                    s.status, s.created_at AS status_created_at, 
                    ac.min_dhis2_version, ac.max_dhis2_version, 
                    c.name AS channel_name, c.uuid AS channel_uuid,
                    users.id AS developer_id, users.uuid AS developer_uuid, users.name AS developer_name,
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

exports.down = async knex => {
    await knex.raw('DROP VIEW apps_view')
}
