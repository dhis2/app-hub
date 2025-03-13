exports.up = async (knex) => {
    return knex.schema.table('app_version', (table) => {
        table.integer('download_count').defaultTo(0).notNullable()
    })
}

exports.down = async (knex) => {
    return knex.schema.table('app_version', (table) => {
        table.dropColumn('download_count')
    })
}
