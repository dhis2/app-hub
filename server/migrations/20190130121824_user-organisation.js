exports.up = async knex => {
    await knex.schema.createTable('user_organisation', table => {
        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.timestamp('updated_at', true)

        table.uuid('user_id').notNullable()

        table.uuid('organisation_id').notNullable()

        table.unique(['user_id', 'organisation_id'])

        table
            .foreign('user_id')
            .references('id')
            .inTable('users')

        table
            .foreign('organisation_id')
            .references('id')
            .inTable('organisation')
    })

    await knex.raw(`
        CREATE VIEW users_with_organisations  
        AS SELECT u.id AS user_id, u.name as user_name, u.email, o.name AS organisation_name, o.id AS organisation_id FROM users AS u 
            INNER JOIN user_organisation AS dorg 
                ON dorg.user_id = user_id 
            INNER JOIN organisation AS o 
                ON o.id = dorg.organisation_id
        `)
}

exports.down = async knex => {
    await knex.raw('DROP VIEW users_with_organisations')
    await knex.schema.dropTable('user_organisation')
}
