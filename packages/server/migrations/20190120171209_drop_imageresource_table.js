exports.up = async function(knex, Promise) {
    await knex.schema.dropTable('imageresource')
}

exports.down = async function(knex, Promise) {
    await knex.schema.createTable('imageresource', t => {
        t.integer('imageid')
            .unsigned()
            .primary()

        t.string('uid')
        t.timestamp('created', true)
        t.timestamp('lastupdated', true)
        t.text('caption')
        t.text('description')
        t.text('imageurl')

        t.boolean('logo')
        t.integer('appid')

        t.foreign('appid')
            .references('appid')
            .inTable('app')
    })

    const mapped_apps = await knex({
        a: 'app',
        b: 'apps',
    })
        .select({
            aId: 'a.appid',
            bId: 'b.app_id',
            aName: 'a.name',
            bName: 'b.name',
        })
        .whereRaw('?? = ??', ['a.name', 'b.name'])

    const images = await knex('images')
        .select()
        .map(image => {
            const id = mapped_apps.filter(a => a.bId === image.app)[0]

            return {
                imageid: image.image_id,
                uid: image.uuid,
                created: image.created_at,
                lastupdated: image.updated_at,
                caption: image.caption,
                description: image.description,
                imageurl: image.url,
                logo: image.logo,
                appid: id.aId,
            }
        })

    await knex('imageresource').insert(images)
}
