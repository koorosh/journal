import Knex from 'knex'

const config: Knex.Config = {
  client: process.env.DB_CLIENT,
  connection: process.env.DATABASE_URL,
  migrations: {
    stub: 'migration.stub',
    tableName: "knex_migrations",
  },
  seeds: {
    stub: 'seeds.stub'
  }
}

module.exports = config
