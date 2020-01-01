const tableName = 'students'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary('students_id').notNullable()
    t.uuid('person_id')
      .references('id')
      .inTable('persons')
      .onDelete('CASCADE')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
