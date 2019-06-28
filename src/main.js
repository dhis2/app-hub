const dotenv = require('dotenv')

const Knex = require('knex')
const knexConfig = require('../knexfile.js')

const { migrate } = require('./server/migrate-database.js')
const { compile } = require('./server/compile-webapp.js')
const { init } = require('./server/init-server.js')

console.log('Using env: ', process.env.NODE_ENV)

const knex = Knex(knexConfig[process.env.NODE_ENV])

if (process.env.NODE_ENV !== 'production') {
    const config = dotenv.config()
    console.log('Injecting config vars into process.env: ', config)
}

process.on('unhandledRejection', err => {
    console.log(err)
    process.exit(1)
})

// Start the madness.
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
    .then(() => init(knex))
    .catch(err => {
        console.error('The server failed to start.\n', err)
        process.exit(1)
    })
