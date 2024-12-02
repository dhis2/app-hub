exports.up = async (knex) => {
    await knex.schema.createTable('media_type', (table) => {
        table.uuid('id').primary()

        table.string('description', 100)

        table.string('mime', 255)
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('media_type')
}
