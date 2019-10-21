exports.up = async function(knex, Promise) {
    await knex.raw('DROP VIEW users_with_organisations')
    await knex.raw(`
        CREATE VIEW users_with_organisations
        AS SELECT u.id AS user_id, u.uuid AS user_uuid, u.name as user_name, u.email, o.name AS organisation_name, o.id as organisation_id, o.uuid AS organisation_uuid FROM users AS u 
            INNER JOIN user_organisation AS dorg 
                ON dorg.user_id = u.id 
            INNER JOIN organisation AS o 
                ON o.id = dorg.organisation_id
        `)
}

exports.down = async function(knex, Promise) {}
