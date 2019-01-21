exports.up = async function(knex, Promise) {
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

    const ires = await knex('imageresource')
        .whereNotNull('appid')
        .select()

    const updated_imgs = ires.map(i => {
        const id = mapped_apps.filter(a => a.aId === i.appid)[0]

        return {
            caption: i.caption,
            created_at: i.created,
            updated_at: i.lastupdated,
            description: i.description,
            url: i.imageurl,
            logo: i.logo,
            app: id.bId,
        }
    })

    await knex('images').insert(updated_imgs)
}

exports.down = async function(knex, Promise) {
    await knex('images').del()
}
