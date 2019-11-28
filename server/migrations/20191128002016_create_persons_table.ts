import Knex from 'knex'

const tableName = 'persons'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.string('first_name', 255).notNullable()
    t.string('last_name', 255).notNullable()
    t.string('phone')

  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
