const debug = require('debug')('apphub:server:boot:database')
exports.migrate = async knex => {
    if (process.env.SKIP_MIGRATION === 'true') {
        debug('SKIP_MIGRATION=true, skipping database migration')
        return false
    }
    debug('Running database migrations...')
    return knex.migrate.latest()
}
