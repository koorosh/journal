import SqlDatasource from './sql-datasource'
import {Group} from '../types'
import uuid from 'uuid'

export class GroupDatasource extends SqlDatasource {
  selectAll(): Promise<Array<Group>> {
    return this.db.from('groups')
      .then(records => records.map(GroupDatasource.groupReducer))
  }

  findById(id: string) {
    return this.db
      .from('groups')
      .where({
        id
      })
      .first()
      .then(GroupDatasource.groupReducer)
  }

  async create({name}: Partial<Group>): Promise<string> {
    const id = uuid()
    await this.db.table('groups').insert({
      id,
      name
    })
    return id
  }

  static groupReducer(groupRecord: any): Group {
    const { id, name, year } = groupRecord
    return {
      id: id,
      name: name,
      year
    }
  }
}
