import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`

  type Group {
    id: ID!
    name: String!
    year: Int!
    students: [Student]
  }
  
  extend type Query {
    groups: [Group]
    group(id: ID!): Group
    groupsByYear(year: Int!): [Group]
    groupsThisYear: [Group]
  }
  
  extend type Mutation {
    createGroup(
      name: String!
      year: Int!
    ): Group

    addStudentToGroup(
      groupId: ID!
      studentId: ID!
    ): Group
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    groups: (_, __, { dataSources }) => dataSources.groups.selectAll(),
    group: (_, { id }, { dataSources }) => dataSources.groups.findById(id),
    groupsByYear: (_, { year }, { dataSources }) => dataSources.groups.findByYear(year),
    groupsThisYear: (_, { year }, { dataSources }) => dataSources.groups.findByYear(new Date().getFullYear()),
  },
  Mutation: {
    createGroup: (_, { name, year }, { dataSources }) =>
      dataSources.groups.create(name, year),
    addStudentToGroup: (_, { groupId, studentId }, { dataSources }) =>
      dataSources.groups.addStudent(groupId, studentId),
  },
}
