exports.up = async function(knex, Promise) {
    const apps = await knex('app').select()

    const updated_apps = apps.map(a => {
        return {
            name: a.name,
            description: a.description,
            created_at: a.created,
            updated_at: a.lastupdated,
            status: a.status,
            source_url: a.sourceurl || a.sourceUrl,
            organisation: a.organisation,
            developer: a.developer,
        }
    })

    await knex('apps').insert(updated_apps)
}

exports.down = async function(knex, Promise) {
    await knex('apps').del()
}
