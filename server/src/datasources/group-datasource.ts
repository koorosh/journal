import SqlDatasource from './sql-datasource'
import {Group} from '../types'
import uuid from 'uuid'

export class GroupDatasource extends SqlDatasource {
  selectAll() {
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

  create({name}: Partial<Group>): Promise<Group | null> {
    return this.db.table('groups').insert({
      id: uuid(),
      name
    })
      .returning('*')
      .then(records => {
        if (records.length > 0) {
          return GroupDatasource.groupReducer(records[0])
        }
        else {
          return null
        }
      })
  }

  static groupReducer(groupRecord: any): Group {
    const { id, name } = groupRecord
    return {
      id: id,
      name: name,
    }
  }
}
