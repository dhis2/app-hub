const debug = require('debug')('apphub:server:boot')

const knexConfig = require('../knexfile')
const knex = require('knex')(knexConfig)

const { createChannel } = require('./data/index.js')

const { migrate } = require('./server/migrate-database.js')
const { init } = require('./server/init-server.js')
const { config } = require('./server/env-config.js')

debug('Using env: ', process.env.NODE_ENV)

process.on('unhandledRejection', err => {
    debug(err)
    process.exit(1)
})

migrate(knex)
    .catch(err => {
        debug('The database migrations failed to apply.\n', err)
        process.exit(1)
    })
    .then(() =>
        knex.transaction(trx => createChannel({ name: 'Stable' }, knex, trx))
    )
    .then(r => debug('Channel was created', r))
    .catch(r => debug('Channel probably exists, skipping', r))
    .then(() => init(knex, config))
    .catch(err => {
        debug('The server failed to start.\n', err)
        process.exit(1)
    })
