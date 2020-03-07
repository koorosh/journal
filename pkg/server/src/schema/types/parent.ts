import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`

  type Parent {
    id: ID!
    person: Person!
  }

  extend type Query {
    parentsByStudentId(studentId: ID!): [Person]
  }

  extend type Mutation {
    createParent(
      firstName: String!
      lastName: String!
      phone: String
      relationship: String!
      childPersonId: ID!
    ): Parent
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    // TODO: parentsByStudentId ???
  },
  Mutation: {
    createParent: (_, { firstName, lastName, phone, childPersonId }, { dataSources }) =>
      dataSources.parents.create(firstName, lastName, phone),
  },
}
