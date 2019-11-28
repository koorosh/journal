import uuid from 'uuid'
import SqlDatasource from './sql-datasource'
import {Student} from '../types'

export class StudentDatasource extends SqlDatasource {
  selectAll(): Promise<Array<Student>> {
    return this.db.from('students')
      .innerJoin('persons', 'students.person_id', '=', 'persons.id')
      .then(records => {
        return records.map(record => ({
          id: record.id,
          firstName: record.first_name,
          lastName: record.last_name,
          phone: record.phone,
        }))
      })
  }

  findById(id: string): Promise<Student> {
    return this.db.from('students')
      .innerJoin('persons', 'students.person_id', '=', 'persons.id')
      .where({
        ['students.id']: id,
      })
      .first()
      .then(record => ({
        id: record.id,
        firstName: record.first_name,
        lastName: record.last_name,
        phone: record.phone,
      }))
  }

  create({firstName, lastName, phone}: Partial<Student>): Promise<string> {
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

      return studentId
    })
  }
}
