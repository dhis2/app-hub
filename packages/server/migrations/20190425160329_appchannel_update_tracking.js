exports.up = async knex => {
    await knex.schema.alterTable('app_channel', function(table) {
        table
            .timestamp('updated_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()

        table.integer('updated_by_user_id').unsigned()

        table
            .foreign('updated_by_user_id')
            .references('id')
            .inTable('users')
    })
}

exports.down = async knex => {
    await knex.schema.table('app_channel', table => {
        table.dropColumns('updated_by_user_id', 'updated_at')
    })
}
