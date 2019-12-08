import Knex from 'knex'

const tableName = 'groups'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary('groups_id').notNullable()
    t.string('name', 255).notNullable()
    t.integer('year').notNullable().index()
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
