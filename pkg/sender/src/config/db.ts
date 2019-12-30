import Knex from 'knex'

const db = Knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  }
})

export default db