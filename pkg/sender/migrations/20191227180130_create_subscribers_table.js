const tableName = 'subscribers'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.string('subscriber_id').unique()
    t.boolean('is_active').defaultTo(true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
