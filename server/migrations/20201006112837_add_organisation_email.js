exports.up = function (knex) {
    return knex.schema.table('organisation', (table) => {
        table.string('email')
    })
}

exports.down = function (knex) {
    return knex.schema.table('organisation', (table) => {
        table.dropColumn('email')
    })
}
