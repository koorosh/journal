import Knex from 'knex'

const config: Knex.Config = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  },
  migrations: {
    stub: 'migration.stub',
    tableName: "knex_migrations",
  },
  seeds: {
    stub: 'seeds.stub'
  }
}

module.exports = config
