import Knex from 'knex'

const tableName = 'absent_students'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.uuid('student_id').references('id').inTable('students')
    t.uuid('group_id').references('id').inTable('groups')
    t.uuid('subject_id').references('id').inTable('subjects')
    t.integer('reason').notNullable().defaultTo(0)
    t.integer('lesson_no').notNullable()
    t.date('date').notNullable()
    t.timestamps(false, true)
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
