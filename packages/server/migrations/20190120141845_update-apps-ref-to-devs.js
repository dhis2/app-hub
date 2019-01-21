exports.up = async function(knex, Promise) {
    // grab existing devs and map them to the new table
    const app_devs = await knex('app').select(
        'appid',
        'developername',
        'email',
        'owner'
    )

    const updated_apps = []

    for (const dev of app_devs) {
        const updated = await knex('developers')
            .select('developer_id')
            .where({
                email: dev.email,
            })

        updated_apps.push({
            appid: dev.appid,
            developer: updated[0].developer_id,
        })
    }

    // drop existing varchar fields
    await knex.schema.table('app', table => {
        table.dropColumn('email')
        table.dropColumn('owner')
        table.dropColumn('developername')
    })

    await knex.schema.table('app', table => {
        table
            .integer('developer')
            .unsigned()
            .nullable()
        table
            .foreign('developer')
            .references('developer_id')
            .inTable('developers')
    })

    for (const app of updated_apps) {
        await knex('app')
            .where({
                appid: app.appid,
            })
            .update({
                developer: app.developer,
            })
    }
}

exports.down = async function(knex, Promise) {
    // get all apps and org ids
    const app_devs = await knex('app').select('appid', 'developer')

    // get all the orgs
    const devs = await knex('developers').select(
        'developer_id',
        'oauth',
        'email',
        'name'
    )

    const restored_apps = app_devs.map(app => {
        const dev = devs.filter(dev => app.developer === dev.developer_id)

        return {
            appid: app.appid,
            developername: dev[0].name,
            email: dev[0].email,
            owner: dev[0].oauth,
        }
    })

    // drop the fk org field
    await knex.schema.table('app', table => {
        table.dropColumn('developer')
    })

    // recreate varchar fields
    await knex.schema.table('app', table => {
        table.string('developername')
        table.string('owner')
        table.string('email')
    })

    for (const app of restored_apps) {
        await knex('app')
            .where({
                appid: app.appid,
            })
            .update({
                developername: app.developername,
                email: app.email,
                owner: app.owner,
            })
    }
}
