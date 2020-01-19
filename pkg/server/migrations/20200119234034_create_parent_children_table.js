const tableName = 'parent_children'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('parent_id')
      .references('id')
      .inTable('parents')
      .onDelete('CASCADE')
    t.uuid('child_person_id')
      .references('id')
      .inTable('persons')
      .onDelete('CASCADE')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}