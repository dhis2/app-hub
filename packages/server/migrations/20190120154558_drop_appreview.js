exports.up = async function(knex, Promise) {
    await knex.schema.dropTable('appreview')
}

exports.down = async function(knex, Promise) {
    await knex.schema.createTable('appreview', t => {
        t.integer('reviewid')
            .unsigned()
            .primary()
        t.string('uid')
        t.timestamp('created', true)
        t.timestamp('lastupdated', true)
        t.text('reviewtext')
        t.integer('rate')
        t.string('userid')
        t.integer('appid')

        t.foreign('appid')
            .references('appid')
            .inTable('app')
    })
}
