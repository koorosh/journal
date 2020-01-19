const tableName = 'group_students'

exports.up = function(knex) {
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

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
