exports.up = async (knex) => {
    await knex.schema.table('organisation', (table) => {
        table.string('description', 1000).nullable()
    })
}

exports.down = async (knex) => {
    await knex.schema.table('organisation', (table) => {
        table.dropColumn('description')
    })
}
