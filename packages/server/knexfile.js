const config = require('dotenv').config({ path: `${require('os').homedir()}/.dhis2/appstore/vars` })

module.exports = {
    test: {
        client: 'sqlite3',
        connection: {
            filename: './appstore_dev.sqlite',
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
        useNullAsDefault: true,
    },
    development: {
        client: 'pg',
        connection: {
            host: '127.0.0.1',
            user: 'appstore',
            password: 'appstore123',
            database: 'appstore',
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
    production: {
        client: 'pg',
        connection: {
            host: process.env.RDS_HOSTNAME,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            database: process.env.RDS_DB_NAME
        },
        searchPath: ['knex', 'public', 'postgres', 'appstore'],
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },

}
