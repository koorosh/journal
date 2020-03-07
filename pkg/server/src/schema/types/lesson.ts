import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`

  type Lesson {
    id: ID!
    subject: Subject
    teacher: Teacher
    group: Group
    date: Date
    order: Int
    lastAttendanceCheck: Date
  }
  
  extend type Query {
    lessonsByTeacher(teacherId: ID!, date: Date!): [Lesson]
    lesson(id: ID!): Lesson
  }

  extend type Mutation {
    createLesson(
      subjectId: ID!
      groupId: ID!
      teacherId: ID!
      order: Int!
      date: Date!
    ): Lesson
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    lessonsByTeacher: (_, { teacherId, date }, { dataSources }) =>
      dataSources.lessons.findLessonsByTeacherAndDate(teacherId, date),
    lesson: (_, { id }, { dataSources }) => dataSources.lessons.findById(id),
  },
  Mutation: {
    createLesson: (_, { order, date, subjectId, groupId, teacherId }, { dataSources }) =>
      dataSources.lessons.create(date, order, subjectId, groupId, teacherId),
  },
}
