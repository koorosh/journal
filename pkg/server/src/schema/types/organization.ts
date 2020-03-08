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
    getOrganization(id: ID!): Organization
    getOrganizations: [Organization]
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    getOrganization: (_, { id }, { dataSources }) => dataSources.organizations.findById(id),
    getOrganizations: (_, __, { dataSources }) => dataSources.organizations.selectAll(),
  }
}
