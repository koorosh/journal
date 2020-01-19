const tableName = 'lessons'

exports.up = function(knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.string('order_no')
    t.uuid('group_id').references('id').inTable('groups').onDelete('CASCADE')
    t.uuid('subject_id').references('id').inTable('subjects').onDelete('CASCADE')
    t.uuid('teacher_id').references('id').inTable('teachers').onDelete('CASCADE')
    t.date('date')
    t.timestamps(false, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
}