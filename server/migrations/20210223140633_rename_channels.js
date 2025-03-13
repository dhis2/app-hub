exports.up = async (knex) => {
    await knex.raw(`UPDATE channel SET name = 'stable' WHERE name = 'Stable'`)
    await knex.raw(
        `UPDATE channel SET name = 'development' WHERE name = 'Development'`
    )
    await knex.raw(`UPDATE channel SET name = 'canary' WHERE name = 'Canary'`)
}

exports.down = async (knex) => {
    await knex.raw(`UPDATE channel SET name = 'Stable' WHERE name = 'stable'`)
    await knex.raw(
        `UPDATE channel SET name = 'Development' WHERE name = 'development'`
    )
    await knex.raw(`UPDATE channel SET name = 'Canary' WHERE name = 'canary'`)
}
