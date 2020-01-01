const tableName = 'subjects'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.string('name')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
