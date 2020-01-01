const tableName = 'person_subscribers'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.uuid('person_id').notNullable()
    t.string('code')
    // contains unique user identifier received from messengers.
    t.string('subscriber_id').unique()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
