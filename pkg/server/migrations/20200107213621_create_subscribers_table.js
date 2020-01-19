const tableName = 'subscribers'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.uuid('person_id')
      .references('id')
      .inTable('persons')
      .onDelete('CASCADE')
    t.boolean('is_active')
    t.dateTime('subscribed_on').notNullable()
    t.dateTime('unsubscribed_on')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
