const dotenv = require('dotenv').config()

const debug = require('debug')('apphub:server:knexconfig')

debug(`process.env.RDS_HOSTNAME: ${process.env.RDS_HOSTNAME}`)
debug(`process.env.RDS_USERNAME: ${process.env.RDS_USERNAME}`)
debug(`process.env.RDS_DB_NAME: ${process.env.RDS_DB_NAME}`)
debug(`process.env.RDS_DB_PORT: ${process.env.RDS_DB_PORT}`)

module.exports = {
    client: 'pg',
    connection: {
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DB_NAME,
        port: process.env.RDS_DB_PORT || 5432, //fallback to postgres port as that's what we normally use
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
