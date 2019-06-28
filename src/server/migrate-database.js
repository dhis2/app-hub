exports.migrate = (knex) => {
    console.info('Running database migrations...')
    return knex.migrate.latest()
}
