const debug = require('debug')('appstore:server:boot:database')
exports.migrate = async knex => {
    debug('Running database migrations...')
    return knex.migrate.latest()
}
