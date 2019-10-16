const dotenv = require('dotenv').config()

const debug = require('debug')('appstore:server:knexconfig')

debug(`process.env.RDS_HOSTNAME: ${process.env.RDS_HOSTNAME}`)
debug(`process.env.RDS_USERNAME: ${process.env.RDS_USERNAME}`)
debug(`process.env.RDS_DB_NAME: ${process.env.RDS_DB_NAME}`)

module.exports = {
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
}
