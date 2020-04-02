import { makeExecutableSchema } from 'graphql-tools'
import { gql } from 'apollo-server-koa'
import { merge } from 'lodash'
import { GraphQLScalarType } from 'graphql'
import { formatISO, parseISO, startOfDay } from 'date-fns'
import { Kind } from 'graphql/language'

import { typeDef as Attendance, resolvers as AttendanceResolvers } from './types/attendance'
import { typeDef as Group, resolvers as GroupResolvers } from './types/group'
import { typeDef as Lesson, resolvers as LessonResolvers } from './types/lesson'
import { typeDef as Person, resolvers as PersonResolvers } from './types/person'
import { typeDef as Student, resolvers as StudentResolvers } from './types/student'
import { typeDef as Subject, resolvers as SubjectResolvers } from './types/subject'
import { typeDef as Teacher, resolvers as TeacherResolvers } from './types/teacher'
import { typeDef as User, resolvers as UserResolvers } from './types/user'
import { typeDef as Organization, resolvers as OrganizationResolvers } from './types/organization'

const Query = gql`
  # Put fake fields on each Query & Mutation as below because currently schema cannot have empty type
  # If you had Query & Mutation fields not associated with a specific type you could put them here
  type Query {
    _empty: String
  }
  
  type Mutation {
    noop: Boolean
  }
  
  type EmptyResponse {
    status: Boolean
  }

  scalar Date
`;

const SchemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`;

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date without time',
    parseValue(isoDateString: string) {
      return startOfDay(parseISO(isoDateString))
    },
    serialize(value: Date) {
      return formatISO(value, { representation: 'date'})
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return startOfDay(parseISO(ast.value))
      }
      return null;
    },
  }),
};

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    Query,
    Attendance,
    Group,
    Lesson,
    Person,
    Student,
    Subject,
    Teacher,
    User,
    Organization,
  ],
  resolvers: merge(
    resolvers,
    AttendanceResolvers,
    GroupResolvers,
    LessonResolvers,
    PersonResolvers,
    StudentResolvers,
    SubjectResolvers,
    TeacherResolvers,
    UserResolvers,
    OrganizationResolvers,
  ),
});