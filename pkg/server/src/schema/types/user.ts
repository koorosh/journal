import { gql } from 'apollo-server-koa'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`
  type User {
    id: ID!
    phone: String!
    password: String!
    code: String
  }
  extend type Query {
    getUser(id: ID!): User
  }
  extend type Mutation {
    login(id: ID!, password: String!, code: String!): String
    signUp(id: ID!, password: String!): String
    requestCode(phone: String!): Boolean
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    getUser: (_, { phone }, { dataSources }) => {
      return dataSources.users.findByPhone(phone)
    },
  },
  Mutation: {
    signUp: async (root, { phone, password }, { dataSources }) => {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await dataSources.users.create(phone, hashedPassword);

      return jsonwebtoken.sign(
        {
          id: user.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1m' },
      );
    },
    login: async (_, { phone, password, code }, { dataSources }) => {
      const user = await dataSources.users.findByPhone(phone)

      if (!user) {
        throw new Error('No user with that phone');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Incorrect password');
      }

      return jsonwebtoken.sign(
        {
          id: user.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
      );
    },
  },
}
