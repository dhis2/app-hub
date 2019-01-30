module.exports = {
    development_: {
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
        useNullAsDefault: false,
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
}
