import Knex from 'knex'

const db = Knex({
  client: process.env.DB_CLIENT,
  connection: process.env.DATABASE_URL,
})

export default db