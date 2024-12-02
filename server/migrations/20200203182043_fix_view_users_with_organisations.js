exports.up = async (knex) => {
    await knex.raw('DROP VIEW users_with_organisations')
    await knex.raw(`
        CREATE VIEW users_with_organisations  
        AS SELECT u.id AS user_id, u.name as user_name, u.email, o.name AS organisation_name, o.id AS organisation_id FROM users AS u 
            INNER JOIN user_organisation AS dorg 
                ON dorg.user_id = u.id
            INNER JOIN organisation AS o 
                ON o.id = dorg.organisation_id
        `)
}

exports.down = async (knex) => {
    await knex.raw('DROP VIEW users_with_organisations')
    await knex.raw(`
    CREATE VIEW users_with_organisations  
    AS SELECT u.id AS user_id, u.name as user_name, u.email, o.name AS organisation_name, o.id AS organisation_id FROM users AS u 
        INNER JOIN user_organisation AS dorg 
            ON dorg.user_id = user_id 
        INNER JOIN organisation AS o 
            ON o.id = dorg.organisation_id
    `)
}
