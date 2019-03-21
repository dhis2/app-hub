exports.up = async (knex) => {

    await knex.schema.createTable('review', (table) => {

        table
            .increments('id')
            .unsigned()
            .primary()

        table
            .uuid('uuid')
            .unique()
            .notNullable()

        table
            .integer('app_version_id')
            .unsigned()
            .notNullable()

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
            SELECT app.uuid, appver.version, review.rating, review.reviewtext FROM app 
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
