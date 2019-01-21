exports.up = async function(knex, Promise) {
    // grab existing orgs and map them to the new table
    const app_orgs = await knex('app').select('appid', 'organisation')

    const updated_apps = []

    for (const org of app_orgs) {
        const updated = await knex('organisations')
            .select('organisation_id')
            .where({
                name: org.organisation,
            })

        updated_apps.push({
            appid: org.appid,
            organisation: updated[0].organisation_id,
        })
    }

    // drop existing varchar fields
    await knex.schema.table('app', table => {
        table.dropColumn('address')
        table.dropColumn('organisation')
    })

    await knex.schema.table('app', table => {
        table
            .integer('organisation')
            .unsigned()
            .nullable()
        table
            .foreign('organisation')
            .references('organisation_id')
            .inTable('organisations')
    })

    for (const app of updated_apps) {
        await knex('app')
            .where({
                appid: app.appid,
            })
            .update({
                organisation: app.organisation,
            })
    }
}

exports.down = async function(knex, Promise) {
    // get all apps and org ids
    const app_orgs = await knex('app').select('appid', 'organisation')

    // get all the orgs
    const orgs = await knex('organisations').select(
        'organisation_id',
        'address',
        'name'
    )

    const restored_apps = app_orgs.map(app => {
        const org = orgs.filter(org => app.organisation === org.organisation_id)

        return {
            appid: app.appid,
            organisation: org[0].name,
            address: org[0].address,
        }
    })

    // drop the fk org field
    await knex.schema.table('app', table => {
        table.dropColumn('organisation')
    })

    // recreate varchar fields
    await knex.schema.table('app', table => {
        table.string('address')
        table.string('organisation')
    })

    for (const app of restored_apps) {
        await knex('app')
            .where({
                appid: app.appid,
            })
            .update({
                organisation: app.organisation,
                address: app.address,
            })
    }
}
