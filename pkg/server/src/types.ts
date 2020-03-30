import { RouterContext } from 'koa-router'

import {
  AttendanceDataSource,
  GroupDataSource,
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
  persons: PersonDataSource,
  lessons: LessonDataSource,
  teachers: TeacherDataSource,
  users: UserDataSource,
  organizations: OrganizationDataSource,
}

export type UserData = {
  id: string
  roles: UserRoles
  tenantId: string
}

export interface Context {
  dataSources: DataSourceMap
  ctx: RouterContext
  user?: UserData
}