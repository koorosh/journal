const tableName = 'user_roles'

exports.up = function(knex) {
  return knex.raw('DROP TYPE IF EXISTS user_roles_enum CASCADE')
    .then(() => {
      return knex.schema.createTable(tableName, t => {
        t.uuid('user_id')
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
        t.enu(
          'roles',
          ['admin', 'user'],
          {useNative: true, enumName: 'user_roles_enum'})
      })
    })
}

exports.down = function(knex) {
  return Promise.all([
    knex.raw('DROP TYPE user_roles_enum CASCADE'),
    knex.schema.dropTable(tableName)
  ])
}