
exports.up = async (knex) => {

    await knex.schema.createTable('content_type', (table) => {

        table
            .increments('id')
            .unsigned()
            .primary()

        table
            .string('description', 100)

        table
            .string('content_type', 255)

    })
}

exports.down = async (knex) => {

    await knex.schema.dropTable('content_type')
}