import { RouterContext } from 'koa-router'

import {
  AttendanceDataSource,
  GroupDataSource,
  ParentDataSource,
  StudentDataSource,
  SubjectDataSource,
  PersonDataSource,
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
  lessons: LessonDataSource,
  teachers: TeacherDataSource,
  users: UserDataSource,
  organizations: OrganizationDataSource,
}

export type UserData = {
  id: string
  roles: UserRoles
}

export interface Context {
  dataSources: DataSourceMap
  ctx: RouterContext
  user: UserData
}