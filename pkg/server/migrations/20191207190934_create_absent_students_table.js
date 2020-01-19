const tableName = 'absent_students'

exports.up = function(knex) {
  return knex.raw('DROP TYPE IF EXISTS absence_reasons_enum CASCADE')
    .then(() => {
      return knex.schema.createTable(tableName, t => {
        t.uuid('id').primary()
        t.uuid('student_id')
          .references('id')
          .inTable('students')
          .onDelete('CASCADE')
        t.uuid('lesson_id')
          .references('id')
          .inTable('lessons')
          .onDelete('CASCADE')
        t.enu(
          'reason',
          ['illness', 'important', 'no_reason', 'unknown'],
          { useNative: true, enumName: 'absence_reasons_enum' })
        t.date('date')
          .notNullable()
        t.timestamps(false, true)
      })
    })
}

exports.down = function(knex) {
  return Promise.all([
    knex.raw('DROP TYPE absence_reasons_enum CASCADE'),
    knex.schema.dropTable(tableName),
  ])
}
