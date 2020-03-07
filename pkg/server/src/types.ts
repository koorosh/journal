import { Context as KoaContext } from 'koa'

import {
  AttendanceDataSource,
  GroupDataSource,
  ParentDataSource,
  StudentDataSource,
  SubjectDataSource,
  PersonDataSource,
  Publisher,
  LessonDataSource,
  TeacherDataSource, UserDataSource
} from './datasources'
import { User } from './models'

export interface DataSourceMap {
  students: StudentDataSource,
  groups: GroupDataSource,
  subjects: SubjectDataSource,
  attendance: AttendanceDataSource,
  parents: ParentDataSource,
  persons: PersonDataSource,
  publisher: Publisher,
  lessons: LessonDataSource,
  teachers: TeacherDataSource,
  users: UserDataSource,
}

export type ExtContext = {
  user: User
}

export interface Context {
  dataSources: DataSourceMap,
  user?: User,
  ctx: KoaContext & ExtContext
}