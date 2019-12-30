import SqlDatasource from './sql-datasource'
import { Person } from '../types'

export class ParentDatasource extends SqlDatasource {
  getParentsByStudentId(personId: string): Promise<Array<Person>> {
    return this.db
      .select([
        'persons.id',
        'persons.first_name',
        'persons.last_name',
        'persons.phone',
      ])
      .from('parents')
      .innerJoin('persons', 'parents.person_id', '=', 'persons.id')
      .where('parents.child_id', '=', personId)
      .then(records => {
        return records.map(record => ({
          id: record.id,
          firstName: record.first_name,
          lastName: record.last_name,
          phone: record.phone,
        }))
      })
  }
}
