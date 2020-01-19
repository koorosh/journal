const tableName = 'teacher_positions'

exports.up = function(knex) {
  return knex.raw('DROP TYPE IF EXISTS teacher_positions_enum CASCADE')
    .then(() => {
      return knex.schema.createTable(tableName, t => {
        t.uuid('teacher_id')
          .references('id')
          .inTable('teachers')
          .onDelete('CASCADE')
        t.enu(
          'position',
          ['teacher', 'class_adviser', 'director'],
          {useNative: true, enumName: 'teacher_positions_enum'})
      })
    })
}

exports.down = function(knex) {
  return Promise.all([
    knex.raw('DROP TYPE teacher_positions_enum CASCADE'),
    knex.schema.dropTable(tableName)
  ])
}