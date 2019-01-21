exports.up = async function(knex, Promise) {
    await knex.schema.dropTable('appversion')
}

exports.down = async function(knex, Promise) {
    await knex.schema.createTable('appversion', t => {
        t.integer('versionid')
            .unsigned()
            .notNullable()
            .primary()

        t.string('uid')
        t.timestamp('created', true)
        t.timestamp('lastupdated', true)

        t.string('version')
        t.string('mindhisversion')
        t.string('maxdhisversion')
        t.text('demourl')
        t.text('downloadurl')

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

    const vers = await knex('versions')
        .select()
        .map(ver => {
            const id = mapped_apps.filter(a => a.bId === ver.app)[0]

            return {
                versionid: ver.version_id,
                uid: ver.uuid,
                created: ver.created_at,
                lastupdated: ver.updated_at,
                maxdhisversion: ver.max_dhis_version,
                mindhisversion: ver.min_dhis_version,
                demourl: ver.demo_url,
                downloadurl: ver.download_url,
                version: ver.version,
                appid: id.aId,
            }
        })

    await knex('appversion').insert(vers)
}
