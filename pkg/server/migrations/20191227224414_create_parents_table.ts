import Knex from 'knex'

const tableName = 'parents'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').primary()
    t.uuid('person_id')
      .references('id')
      .inTable('persons')
      .onDelete('CASCADE')
    t.uuid('child_id')
      .references('id')
      .inTable('persons')
      .onDelete('CASCADE')
    t.string('relationship')
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName)
}
