import Knex from 'knex'

const tableName = 'person_subscribers'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.uuid('person_id').notNullable()
    t.string('code')
    // contains unique user identifier received from messengers.
    t.string('subscriber_id').unique()
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
