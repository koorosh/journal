import { AttendanceDatasource, GroupDatasource, StudentDatasource, SubjectDatasource } from './datasources'

export interface DatasourceMap {
  students: StudentDatasource,
  groups: GroupDatasource,
  subjects: SubjectDatasource,
  attendance: AttendanceDatasource,
}

export interface Context {
  dataSources: DatasourceMap
}

export type WithoutId<T> = Omit<T, 'id'>

export interface Student {
  id: string
  firstName: string
  lastName: string
  phone: string
}

export interface Group {
  id: string
  name: string
  year: number
}

export interface Subject {
  id: string
  name: string
}

export interface Attendance {
  id: string
  subjectId: string
  groupId: string
  date: Date
  lessonNo: number
  absentStudentIds: string[]
}
