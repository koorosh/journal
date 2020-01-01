const tableName = 'persons'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.string('first_name', 255).notNullable()
    t.string('last_name', 255).notNullable()
    t.string('phone')

  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
