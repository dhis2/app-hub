require('dotenv').config()

const createUser = require('./helpers/createM2MUser.js')

const knexConfig = {
    client: 'pg',
    connection: {
        host: process.env.RDS_HOSTNAME || '127.0.0.1',
        user: process.env.RDS_USERNAME || 'apphub',
        password: process.env.RDS_PASSWORD || 'apphub',
        database: process.env.RDS_DB_NAME || 'apphub',
        port: process.env.RDS_DB_PORT || 5432,
    },
    searchPath: ['knex', 'public', 'postgres', 'apphub'],
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'knex_migrations',
    },
}

const knex = require('knex')(knexConfig)

createUser(knex)
    .then(() => process.exit(0))
    .catch(err => {
        console.log('Could not create user: ' + err.message)
        process.exit(1)
    })
