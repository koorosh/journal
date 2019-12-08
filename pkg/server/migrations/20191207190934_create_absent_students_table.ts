import Knex from 'knex'

const tableName = 'absent_students'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.uuid('attendance_id').references('id').inTable('attendances')
    t.uuid('student_id').references('id').inTable('students')
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
