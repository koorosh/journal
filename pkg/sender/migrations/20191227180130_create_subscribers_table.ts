import Knex from 'knex'

const tableName = 'subscribers'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.string('subscriber_id').unique()
    t.boolean('is_active').defaultTo(true)
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
