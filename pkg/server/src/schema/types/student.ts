import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`

  type Student {
    id: ID!
    person: Person!
    group: Group
  }
  
  extend type Query {
    student(id: ID!): Student
    students: [Student]
  }

  extend type Mutation {
    createStudent(
      firstName: String!
      lastName: String!
      phone: String
      groupId: ID
    ): Student
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    students: (_, __, { dataSources }) => dataSources.students.selectAll(),
    student: (_, { id }, { dataSources }) => dataSources.students.findById(id),
  },
  Mutation: {
    createStudent: (_, { firstName, lastName, phone, groupId }, { dataSources }) =>
      dataSources.students.create(firstName, lastName, phone, groupId),
  },
}
