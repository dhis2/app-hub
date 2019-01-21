exports.up = async function(knex, Promise) {
    await knex.schema.createTable('images', t => {
        t.increments('image_id')
            .unsigned()
            .primary()
        t.uuid('uuid')
            .defaultTo(knex.raw('uuid_generate_v4()'))
            .notNullable()
        t.timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()
        t.timestamp('updated_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()
        t.text('caption')
        t.text('description')
        t.text('url')
        t.boolean('logo')

        t.integer('app')
            .unsigned()
            .nullable()
        t.foreign('app')
            .references('app_id')
            .inTable('apps')
    })
}

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('images')
}
