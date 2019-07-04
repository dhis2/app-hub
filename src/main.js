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

// Compile the app
if (process.env.USE_PREBUILT_APP) {
    console.info('Using prebuilt web app')
} else {
    compile()
        .catch(err => {
            console.error('The web app failed to compile.\n', err)
            process.exit(1)
        })
}

    
// Setup the database
migrate(knex)
    .catch(err => {
        console.error('The database migrations failed to apply.\n', err)
        process.exit(1)
    })

// We assume that the Stable channel exists already
createChannel({name: 'Stable'}, knex)
    .catch(err => console.log('Did not create the channel, it probably exists so we can continue.\n', err))

// Start the server
init(knex)
    .catch(err => {
        console.error('The server failed to start.\n', err)
        process.exit(1)
    })
