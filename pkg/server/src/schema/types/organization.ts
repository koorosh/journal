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
  extend type Mutation {
    createOrganization(
      name: String!
      adminUserId: ID!
    ): Organization
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    organizationById: (_, { id }, { dataSources }) => dataSources.organizations.findById(id),
    organizations: (_, __, { dataSources }) => dataSources.organizations.selectAll(),
  },
  Mutation: {
    createOrganization: (_, { name, adminUserId }, { dataSources }) =>
      dataSources.organizations.create(name, adminUserId),
  }
}
