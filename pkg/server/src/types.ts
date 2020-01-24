import {
  AttendanceDataSource,
  GroupDataSource,
  ParentDataSource,
  StudentDataSource,
  SubjectDataSource,
  PersonDataSource,
  Publisher,
  LessonDataSource,
  TeacherDataSource
} from './datasources'

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
}

export interface Context {
  dataSources: DataSourceMap
}