exports.up = async function(knex, Promise) {
    await knex.schema.createTable('versions', t => {
        t.increments('version_id')
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

        t.string('version').nullable()
        t.string('min_dhis_version').nullable()
        t.string('max_dhis_version').nullable()

        t.text('demo_url').nullable()
        t.text('download_url').nullable()

        t.integer('app')
            .unsigned()
            .nullable()

        t.foreign('app')
            .references('app_id')
            .inTable('apps')
    })
}

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('versions')
}
