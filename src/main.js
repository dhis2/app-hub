const debug = require('debug')('appstore:server:boot')

const dotenv = require('dotenv').config()
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DB_NAME,
    },
    searchPath: ['knex', 'public', 'postgres', 'appstore'],
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'knex_migrations',
    },
})

const { createChannel } = require('./data/index.js')

const { migrate } = require('./server/migrate-database.js')
const { compile } = require('./server/compile-webapp.js')
const { init } = require('./server/init-server.js')

debug('Using env: ', process.env.NODE_ENV)

process.on('unhandledRejection', err => {
    debug(err)
    process.exit(1)
})

compile()
    .catch(err => {
        debug('The web app failed to compile.\n', err)
        process.exit(1)
    })
    .then(() => migrate(knex))
    .catch(err => {
        debug('The database migrations failed to apply.\n', err)
        process.exit(1)
    })
    .then(() =>
        knex.transaction(trx => createChannel({ name: 'Stable' }, knex, trx))
    )
    .then(r => debug('Channel was created', r))
    .catch(r => debug('Channel probably exists, skipping', r))
    .then(() => init(knex))
    .catch(err => {
        debug('The server failed to start.\n', err)
        process.exit(1)
    })
