exports.up = async knex => {
    await knex.schema.alterTable('app_version_media', table => {
        table.string('caption', 255)
        table.string('description', 255)
    })
}

exports.down = async (knex, Promise) => {
    await knex.schema.alterTable('app_version_media', table => {
        table.dropColumns('caption', 'description')
    })
}
