import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`
  type User {
    id: ID!
    phone: String!
    person: Person
    roles: [String]
    organization: Organization!
    isActive: Boolean!
    status: String
  }
  extend type Query {
    getUser(id: ID!): User
    currentUser: User
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    getUser: (_, { id }, { dataSources }) => dataSources.users.findById(id),
    currentUser: (_, __, { ctx, dataSources }) =>
      dataSources.users.findById(ctx.user.id)
  }
}
