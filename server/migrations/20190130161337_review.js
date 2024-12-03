exports.up = async (knex) => {
    await knex.schema.createTable('review', (table) => {
        table.uuid('id').primary()

        table.uuid('app_version_id').notNullable()

        table
            .foreign('app_version_id')
            .references('id')
            .inTable('app_version')
            .onDelete('CASCADE')

        table.string('reviewtext')

        table.integer('rating').notNullable()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()
    })

    await knex.raw(`
        CREATE VIEW app_review AS 
            SELECT app.id, appver.version, review.rating, review.reviewtext FROM app 
                INNER JOIN app_version AS appver
                    ON app.id = appver.app_id 
                INNER JOIN review 
                    ON review.app_version_id = appver.id
                ORDER BY review.created_at DESC
    `)
}

exports.down = async (knex) => {
    await knex.raw('DROP VIEW app_review')
    await knex.schema.dropTable('review')
}
