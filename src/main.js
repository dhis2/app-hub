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

console.log('Using env: ', process.env.NODE_ENV)

process.on('unhandledRejection', err => {
    console.log(err)
    process.exit(1)
})

compile()
    .catch(err => {
        console.error('The web app failed to compile.\n', err)
        process.exit(1)
    })
    .then(() => migrate(knex))
    .catch(err => {
        console.error('The database migrations failed to apply.\n', err)
        process.exit(1)
    })
    .then(() =>
        knex.transaction(trx => createChannel({ name: 'Stable' }, knex, trx))
    )
    .then(r => console.log('Channel was created', r))
    .catch(r => console.error('Channel probably exists, skipping', r))
    .then(() => init(knex))
    .catch(err => {
        console.error('The server failed to start.\n', err)
        process.exit(1)
    })
