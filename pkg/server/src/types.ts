import {
  AbsenceDatasource,
  GroupDatasource,
  ParentDatasource,
  StudentDatasource,
  SubjectDatasource,
  PersonDatasource,
  Publisher, ClientDatasource,
} from './datasources'

export interface DatasourceMap {
  students: StudentDatasource,
  groups: GroupDatasource,
  subjects: SubjectDatasource,
  absence: AbsenceDatasource,
  parents: ParentDatasource,
  persons: PersonDatasource,
  publisher: Publisher,
  client: ClientDatasource,
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
}

export interface Absence {
  id: string
  studentId: string
  lessonId: string
  reason: 'illness' | 'important' | 'no_reason' | undefined
}

export interface Person {
  id: string
  firstName: string
  lastName: string
  phone: string
}

export interface Lesson {
  id: string
  orderNo: number
  subjectId: string
  groupId: string
  teacherId: string
  date: Date
}

export interface Teacher {
  id: string
  personId: string
}