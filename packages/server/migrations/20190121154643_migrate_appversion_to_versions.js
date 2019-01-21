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

    const vers = await knex('appversion')
        .whereNotNull('appid')
        .select()

    const updated_vers = vers.map(i => {
        const id = mapped_apps.filter(a => a.aId === i.appid)[0]

        return {
            version: i.version,
            min_dhis_version: i.mindhisversion,
            max_dhis_version: i.maxdhisversion,
            demo_url: i.demourl,
            download_url: i.downloadurl,
            created_at: i.created,
            updated_at: i.lastupdated,
            app: id.bId,
        }
    })

    await knex('versions').insert(updated_vers)
}

exports.down = async function(knex, Promise) {
    await knex('versions').del()
}
