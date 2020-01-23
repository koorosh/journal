import uuid from 'uuid'

import SqlDatasource from './sql-datasource'
import { Person, Parent } from '../types'

export class ParentDatasource extends SqlDatasource {
  getParentsByStudentId(studentId: string): Promise<Array<Person>> {
    return this.db
      .select([
        'persons.id',
        'persons.first_name',
        'persons.last_name',
        'persons.phone',
      ])
      .from('parents')
      .innerJoin('persons', 'parents.person_id', '=', 'persons.id')
      .innerJoin('students', 'students.person_id', '=', 'parents.child_id')
      .where('students.id', '=', studentId)
      .then(records => {
        return records.map(record => ({
          id: record.id,
          firstName: record.first_name,
          lastName: record.last_name,
          phone: record.phone,
        }))
      })
  }

  create(firstName: string, lastName: string, phone: string, childPersonId: string): Promise<Parent> {
    return this.db.transaction(async (trx) => {
      const personId = uuid()
      const parentId = uuid()

      await trx.table('persons')
        .insert({
          id: personId,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        })

      await trx.table('parents')
        .insert({
          id: parentId,
          person_id: personId,
        })

      await trx.table('parent_children')
        .insert({
          parent_id: parentId,
          child_id: childPersonId
        })

      const childPerson = await trx.table('persons')
        .where('id', '=', childPersonId)
        .first()

      return {
        id: parentId,
        person: {
          id: personId,
          firstName,
          lastName,
          phone,
        },
        child: {
          id: childPerson.id,
          firstName: childPerson.first_name,
          lastName: childPerson.last_name,
          phone: childPerson.phone,
        },
      }
    })
  }
}
