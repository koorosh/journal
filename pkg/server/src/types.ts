import {
  AbsenceDatasource,
  GroupDatasource,
  ParentDatasource,
  StudentDatasource,
  SubjectDatasource,
  PersonDatasource,
  Publisher,
} from './datasources'

export type ID = string

export interface Record {
  id: ID
}

export interface DatasourceMap {
  students: StudentDatasource,
  groups: GroupDatasource,
  subjects: SubjectDatasource,
  absence: AbsenceDatasource,
  parents: ParentDatasource,
  persons: PersonDatasource,
  publisher: Publisher
}

export interface Context {
  dataSources: DatasourceMap
}

export type WithoutId<T> = Omit<T, 'id'>

export interface Student {
  id: string
  person?: Person
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

export interface Parent {
  id: string
  person: Person
  child: Person
  relationship: string
}

export enum AbsenceReason {
  UNKNOWN = 0,
  ILLNESS = 1,
  PERSONAL = 2,
}

export interface Absence {
  id: string
  studentId: string
  subjectId: string
  groupId: string
  date: Date
  lessonNo: number
  reason: AbsenceReason
}

export interface Person {
  id: string
  firstName: string
  lastName: string
  phone: string
}
