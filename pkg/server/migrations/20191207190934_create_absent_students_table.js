const tableName = 'absent_students'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.uuid('student_id')
      .references('id')
      .inTable('students')
      .onDelete('CASCADE')
    t.uuid('group_id')
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE')
    t.uuid('subject_id')
      .references('id')
      .inTable('subjects')
      .onDelete('CASCADE')
    t.integer('reason')
      .notNullable()
      .defaultTo(0)
    t.integer('lesson_no')
      .notNullable()
    t.date('date')
      .notNullable()
    t.timestamps(false, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
