import uuid from 'uuid'
import SqlDatasource from './sql-datasource'
import {Student} from '../types'

export class StudentDatasource extends SqlDatasource {
  selectAll() {
    return this.db.from('students')
      .then(students => students.map(StudentDatasource.studentReducer))
  }

  findById(id: string) {
    return this.db
      .from('students')
      .innerJoin('groups', 'students.group_id', '=', 'groups.id')
      .where({'students.id': id})
      .first()
      .then(StudentDatasource.studentReducer)
  }

  create({firstName, lastName, groupId}: Partial<Student>): Promise<Student | null> {
    return this.db.table('students').insert({
      id: uuid(),
      first_name: firstName,
      last_name: lastName,
      group_id: groupId,
    })
      .returning('*')
      .then(records => {
        if (records.length > 0) {
          return StudentDatasource.studentReducer(records[0])
        }
        return null
      })
  }

  static studentReducer(studentRecord: any): Student {
    const { id, first_name, last_name, group_id } = studentRecord
    return {
      id: id,
      firstName: first_name,
      lastName: last_name,
      groupId: group_id
    }
  }
}
