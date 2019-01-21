exports.up = async function(knex, Promise) {
    await knex.schema.dropTable('imageresource')
}

exports.down = async function(knex, Promise) {
    await knex.schema.createTable('imageresource', t => {
        t.integer('imageid')
            .unsigned()
            .primary()
        t.string('uid')
        t.timestamp('created', true)
        t.timestamp('lastupdated', true)
        t.text('caption')
        t.text('description')
        t.text('imageurl')

        t.boolean('logo')
        t.integer('appid')

        t.foreign('appid')
            .references('appid')
            .inTable('app')
    })

    // gotta grab the data from images and move it back...
}
