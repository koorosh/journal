import Knex from 'knex'

const config: Knex.Config = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: Number(process.env.POSTGRES_PORT),
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
