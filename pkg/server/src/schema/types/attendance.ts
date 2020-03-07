import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`
  type Attendance {
    id: ID!
    student: Student!
    lesson: Lesson!
    reason: String
  }

  input CreateAttendancePayload {
    lessonId: ID!
    studentId: ID!
    reason: String
  }
  
  extend type Query {
    attendance(id: ID!): Attendance
    attendancesByGroupIdAndDate(groupId: ID!, date: Date!): [Attendance]
    attendancesByLessonId(lessonId: ID!): [Attendance]
  }
  
  extend type Mutation {
    createAttendance(
      attendance: CreateAttendancePayload!
    ): Attendance

    createBatchAttendancesForLesson(
      lessonId: ID!
      attendances: [CreateAttendancePayload]!
    ): [Attendance]
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    attendance: (_, { id }, { dataSources }) => dataSources.attendance.findById(id),
    attendancesByGroupIdAndDate: (_, { groupId, date }, { dataSources }) =>
      dataSources.attendance.findByGroupAndDate(groupId, date),
    attendancesByLessonId: (_, { lessonId }, { dataSources }) =>
      dataSources.attendance.findByLessonId(lessonId),
  },
  Mutation: {
    createAttendance: (_, { attendance }, { dataSources }) =>
      dataSources.attendance.create(attendance.studentId, attendance.lessonId, attendance.reason),
    createBatchAttendancesForLesson: (_, { attendances, lessonId }, { dataSources }) =>
      dataSources.attendance.removeByLessonId(lessonId)
        .then(() => dataSources.attendance.batchCreate(attendances)),
  },
}
