exports.up = async function(knex, Promise) {
    await knex.schema.createTable('reviews', t => {
        t.increments('review_id')
            .unsigned()
            .primary()

        t.uuid('uuid')
            .defaultTo(knex.raw('uuid_generate_v4()'))
            .notNullable()

        t.string('name').notNullable()
        t.text('description').notNullable()

        t.timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()
        t.timestamp('updated_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        t.string('status')
        t.string('type')
        t.string('source_url')

        t.integer('app')
            .unsigned()
            .nullable()
        t.integer('developer')
            .unsigned()
            .notNullable()

        t.foreign('app')
            .references('app_id')
            .inTable('apps')
        t.foreign('developer')
            .references('developer_id')
            .inTable('developers')
    })
}

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('reviews')
}
