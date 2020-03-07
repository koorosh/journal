import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`

  type Subject {
    id: ID!
    name: String
  }

  extend type Query {
    subjects: [Subject]
  }

  extend type Mutation {
    createSubject(
      name: String!
    ): Subject
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    subjects: (_, __, { dataSources }) => dataSources.subjects.selectAll(),
  },
  Mutation: {
    createSubject: (_, { name }, { dataSources }) =>
      dataSources.subjects.create(name),
  },
}
