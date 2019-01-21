exports.up = async function(knex, Promise) {
    await knex.schema.dropTable('app')
}

exports.down = async function(knex, Promise) {
    await knex.schema.createTable('app', t => {
        t.integer('appid')
            .unsigned()
            .notNullable()
            .primary()

        t.string('uid')
        t.timestamp('created', true)
        t.timestamp('lastupdated', true)

        t.string('name')
        t.string('type')
        t.string('status')
        t.string('sourceUrl')
        t.string('sourceurl')

        t.text('description')

        t.integer('organisation')
        t.integer('developer')

        t.foreign('organisation')
            .references('organisation_id')
            .inTable('organisations')

        t.foreign('developer')
            .references('developer_id')
            .inTable('developers')
    })

    const apps = await knex('apps')
        .select()
        .map(app => {
            return {
                appid: app.app_id,
                uid: app.uuid,
                created: app.created_at,
                lastupdated: app.updated_at,
                name: app.name,
                description: app.description,
                type: app.type,
                status: app.status,
                sourceUrl: app.source_url,
                sourceurl: app.source_url,
                organisation: app.organisation,
                developer: app.developer,
            }
        })

    await knex('app').insert(apps)
}
