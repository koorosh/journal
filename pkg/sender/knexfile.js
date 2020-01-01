module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://admin:admin@127.0.0.1:6432/sender_db'
  },

  staging: {
    client: process.env.DB_CLIENT,
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: process.env.DB_CLIENT,
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
