const tableName = 'parents'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.uuid('person_id')
      .references('id')
      .inTable('persons')
      .onDelete('CASCADE')
    t.uuid('child_id')
      .references('id')
      .inTable('persons')
      .onDelete('CASCADE')
    t.string('relationship')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
