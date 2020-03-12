import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`

  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    middleName: String!
    phone: String
    parents: [Parent]
  }
  
  extend type Query {
    person(id: ID!): Person
    persons: [Person]
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    person: (_, { id }, { dataSources }) => dataSources.persons.findById(id),
    persons: (_, __, { dataSources }) => dataSources.persons.selectAll(),
  },
}
