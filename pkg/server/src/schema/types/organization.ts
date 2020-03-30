import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`
  type Organization {
    id: ID!
    name: String!
    shortName: String!
    tenantId: String!
  }
  extend type Query {
    organizationById(id: ID!): Organization
    organizations: [Organization]
  }
  extend type Mutation {
    createOrganization(
      name: String!
      shortName: String!
      tenantId: String!
    ): Organization
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    organizationById: (_, { id }, { dataSources }) => dataSources.organizations.findById(id),
    organizations: (_, __, { dataSources }) => dataSources.organizations.selectAll(),
  },
  Mutation: {
    createOrganization: async (_, data, { dataSources }) => {
      await dataSources.organizations.create(data)
    },
  }
}
