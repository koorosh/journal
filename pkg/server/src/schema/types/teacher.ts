import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`

  type Teacher {
    id: ID!
    person: Person!
  }
  
  extend type Query {
    teachers: [Teacher]
    currentTeacher: Teacher
  }

  extend type Mutation {
    createTeacher(
      firstName: String!
      lastName: String!
      phone: String
    ): Teacher
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    teachers: (_, __, { dataSources }) => dataSources.teachers.selectAll(),
    currentTeacher: (_, __, { dataSources }) => dataSources.teachers.currentTeacher(),
  },
  Mutation: {
    createTeacher: (_, { firstName, lastName, phone }, { dataSources }) =>
      dataSources.teachers.create(firstName, lastName, phone),
  },
}
