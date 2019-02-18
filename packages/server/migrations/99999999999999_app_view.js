exports.up = async knex => {

    await knex.raw(`
        CREATE VIEW apps_view AS 
            SELECT  app.id AS app_id, 
                    app.uuid, app.type,
                    appver.version, appver.uuid AS version_uuid, appver.created_at AS version_created_at, appver.source_url, appver.demo_url,
                    localisedapp.language_code, localisedapp.name, localisedapp.description, localisedapp.slug AS appver_slug, 
                    s.status, s.created_at AS status_created_at, 
                    ac.min_dhis2_version, ac.max_dhis2_version, 
                    c.name AS channel_name, c.uuid AS channel_uuid,
                    "user".id AS developer_id, "user".uuid AS developer_uuid, "user".first_name AS developer_first_name, "user".last_name AS developer_last_name,
                    "user".email AS developer_email,
                    org.name AS organisation, org.slug AS organisation_slug 
                FROM app 

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

                INNER JOIN "user" 
                    ON app.created_by_user_id = "user".id

                INNER JOIN organisation AS org 
                    ON org.id = app.organisation_id
    `)

}


exports.down = async knex => {
    await knex.raw('DROP VIEW apps_view')
}
