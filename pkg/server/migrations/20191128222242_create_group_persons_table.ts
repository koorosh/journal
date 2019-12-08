import Knex from 'knex'

const tableName = 'group_students'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('group_id')
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE')
    t.uuid('student_id')
      .references('id')
      .inTable('students')
      .onDelete('CASCADE')
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
