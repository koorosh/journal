import SqlDatasource from './sql-datasource'
import { Person } from '../types'

export class PersonDatasource extends SqlDatasource {
  findById(id: string): Promise<Person> {
    return this.db.from('persons')
      .where({
        id,
      })
      .first()
      .then(record => ({
        id: record.id,
        firstName: record.first_name,
        lastName: record.last_name,
        phone: record.phone,
      }))
  }
}
