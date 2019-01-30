exports.up = async knex => {
    await knex.schema.createTable('user_organisation', table => {
        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.timestamp('updated_at', true)

        table
            .integer('user_id')
            .unsigned()
            .notNullable()

        table
            .integer('organisation_id')
            .unsigned()
            .notNullable()

        table.unique(['user_id', 'organisation_id'])

        table
            .foreign('user_id')
            .references('id')
            .inTable('user')

        table
            .foreign('organisation_id')
            .references('id')
            .inTable('organisation')
    })

    await knex.raw(`
        CREATE VIEW users_with_organisations  
        AS SELECT u.id AS user_id, u.uuid AS user_uuid, u.first_name, u.last_name, u.email, o.name AS organisation_name, o.uuid AS organisation_uuid FROM "user" AS u 
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
