import {GroupDatasource, StudentDatasource} from './datasources'

export interface DatasourceMap {
  students: StudentDatasource,
  groups: GroupDatasource,
}

export interface Context {
  dataSources: DatasourceMap
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  groupId: string
}

export interface Group {
  id: string
  name: string
}
