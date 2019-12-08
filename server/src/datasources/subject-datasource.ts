import SqlDatasource from './sql-datasource'
import {Subject} from '../types'
import uuid from 'uuid'

export class SubjectDatasource extends SqlDatasource {
  selectAll(): Promise<Array<Subject>> {
    return this.db.from('subjects')
      .then(records => records.map(SubjectDatasource.subjectReducer))
  }

  findById(id: string) {
    return this.db
      .from('subjects')
      .where({
        id
      })
      .first()
      .then(SubjectDatasource.subjectReducer)
  }

  async create({name}: Partial<Subject>): Promise<string> {
    const id = uuid()
    await this.db.table('subjects').insert({
      id,
      name
    })
    return id
  }

  static subjectReducer(record: any): Subject {
    const { id, name } = record
    return {
      id,
      name,
    }
  }
}
