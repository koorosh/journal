import Knex from 'knex'

const db = Knex({
  client: process.env.DB_CLIENT,
  connection: process.env.DATABASE_URL,
})

const closeConnection = () => {
  db.destroy(() => console.info('DB connection is closed'))
}

process.on('SIGTERM', closeConnection)
process.on('SIGINT', closeConnection)
process.on('exit', closeConnection)

export default db