import Knex from 'knex'

const tableName = 'students'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary('students_id').notNullable()
    t.uuid('person_id')
      .references('id')
      .inTable('persons')
      .onDelete('CASCADE')
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
