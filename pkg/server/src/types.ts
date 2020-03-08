import { RouterContext } from 'koa-router'

import {
  AttendanceDataSource,
  GroupDataSource,
  ParentDataSource,
  StudentDataSource,
  SubjectDataSource,
  PersonDataSource,
  Publisher,
  LessonDataSource,
  TeacherDataSource,
  UserDataSource,
  OrganizationDataSource,
} from './datasources'
import { UserRoles } from './models'

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
  organizations: OrganizationDataSource,
}

export type ExtContext = {
  user: {
    id: string
    roles: UserRoles
  }
}

export interface Context {
  dataSources: DataSourceMap,
  ctx: RouterContext & ExtContext
}