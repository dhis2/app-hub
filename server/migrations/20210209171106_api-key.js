exports.up = async function(knex) {
    await knex.schema.createTable('user_api_key', table => {
        table.string('api_key', 64).primary() // sha256 in hex representation is 64 chars

        table
            .uuid('user_id')
            .notNullable()
            .unique()

        table
            .foreign('user_id')
            .references('id')
            .inTable('users')

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()
    })
}

exports.down = async function(knex) {
    await knex.schema.dropTable('user_api_key')
}
