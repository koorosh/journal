import uuid from 'uuid'
import SqlDatasource from './sql-datasource'
import { Person, Student } from '../types'

export class StudentDatasource extends SqlDatasource {
  selectAll(): Promise<Array<Student>> {
    return this.db
      .select([
        'students.id',
        'persons.id AS person_id',
        'persons.first_name',
        'persons.last_name',
        'persons.phone',
      ])
      .from('students')
      .innerJoin('persons', 'students.person_id', '=', 'persons.id')
      .then(records => {
        return records.map(record => ({
          id: record.id,
          person: {
            id: record.person_id,
            firstName: record.first_name,
            lastName: record.last_name,
            phone: record.phone,
          }
        }))
      })
  }

  findById(id: string): Promise<Student> {
    return this.db
      .select([
        'students.id',
        'persons.id AS person_id',
        'persons.first_name',
        'persons.last_name',
        'persons.phone',
      ])
      .from('students')
      .innerJoin('persons', 'students.person_id', '=', 'persons.id')
      .where({
        ['students.id']: id,
      })
      .first()
      .then(record => ({
        id: record.id,
        person: {
          id: record.person_id,
          firstName: record.first_name,
          lastName: record.last_name,
          phone: record.phone,
        }
      }))
  }

  studentsInGroup(groupId: string): Promise<Student[]> {
    return this.db.select([
      'students.id',
      'persons.id AS person_id',
      'persons.first_name',
      'persons.last_name',
      'persons.phone',
    ])
      .from('students')
      .innerJoin('persons', 'students.person_id', '=', 'persons.id')
      .innerJoin('group_students', 'group_students.student_id', '=', 'students.id')
      .where({
        ['group_students.group_id']: groupId,
      })
      .then(records => (
        records.map((record) => ({
          id: record.id,
          person: {
            id: record.person_id,
            firstName: record.first_name,
            lastName: record.last_name,
            phone: record.phone,
          }
        }))))
  }

  create({ firstName, lastName, phone }: Partial<Person>): Promise<Student> {
    return this.db.transaction(async (trx) => {
      const personId = uuid()
      const studentId = uuid()

      await trx.table('persons')
        .insert({
          id: personId,
          first_name: firstName,
          last_name: lastName,
          phone,
        })

      await trx.table('students')
        .insert({
          id: studentId,
          person_id: personId,
        })

      return {
        id: studentId,
        person: {
          id: personId,
          firstName,
          lastName,
          phone,
        }
      }
    })
  }
}
