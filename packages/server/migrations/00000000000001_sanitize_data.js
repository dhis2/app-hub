exports.up = async function(knex, Promise) {
    await knex.raw(
        "update app SET email = 'olavpo@ifi.uio.no' where developername = 'UiO'"
    )
}

exports.down = async function(knex, Promise) {
    // no downgrade needed
}
