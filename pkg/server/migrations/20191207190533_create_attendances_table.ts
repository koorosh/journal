import Knex from 'knex'

const tableName = 'attendances'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.uuid('group_id').references('id').inTable('groups')
    t.uuid('subject_id').references('id').inTable('subjects')
    t.date('date')
    t.integer('lesson_no')
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
