module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'appstore',
      user:     'appstore',
      password: 'appstore123'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
