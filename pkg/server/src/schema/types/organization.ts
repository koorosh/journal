import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`
  type Organization {
    id: ID!
    name: String!
    adminUser: User!
  }
  extend type Query {
    organizationById(id: ID!): Organization
    organizations: [Organization]
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    organizationById: (_, { id }, { dataSources }) => dataSources.organizations.findById(id),
    organizations: (_, __, { dataSources }) => dataSources.organizations.selectAll(),
  }
}
