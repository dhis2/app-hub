exports.up = async function(knex, Promise) {
    const devs = await knex('app')
        .distinct('owner', 'developername', 'email', 'organisation')
        .select()

    const new_devs = await Promise.all(
        devs
            .filter(
                (obj, pos, arr) =>
                    arr.map(x => x['email']).indexOf(obj['email']) === pos
            )
            .map(async x => {
                const org = await knex('organisations')
                    .select('organisation_id')
                    .where({
                        name: x.organisation,
                    })

                return {
                    name: x.developername,
                    oauth: x.owner,
                    email: x.email,
                    organisation: org[0].organisation_id,
                }
            })
    )

    await knex('developers').insert(new_devs)
}

exports.down = async function(knex, Promise) {
    await knex('developers').del()
}
