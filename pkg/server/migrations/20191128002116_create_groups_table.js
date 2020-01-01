const tableName = 'groups'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary('groups_id').notNullable()
    t.string('name', 255).notNullable()
    t.integer('year').notNullable().index()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}
