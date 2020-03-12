import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`
  
  input ParentPersonInput {
    firstName: String!
    lastName: String!
    middleName: String!
    phones: [String]
  }
  
  input StudentInput {
    firstName: String!
    lastName: String!
    middleName: String!
    phones: [String]
    groupId: ID
    parents: [ParentPersonInput]
  }

  type Student {
    id: ID!
    person: Person!
    group: Group
  }
  
  extend type Query {
    student(id: ID!): Student
    students: [Student]
  }

  extend type Mutation {
    createStudent(
      firstName: String!
      lastName: String!
      middleName: String!
      phones: [String]
      groupId: ID
      parents: [ParentPersonInput]
    ): Student

    createStudents(
      students: [StudentInput]
    ): [Student]
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    students: (_, __, { dataSources }) => dataSources.students.selectAll(),
    student: (_, { id }, { dataSources }) => dataSources.students.findById(id),
  },
  Mutation: {
    createStudent: (_, { firstName, lastName, middleName, phones, groupId, parents }, { dataSources }) =>
      dataSources.students.create(firstName, lastName, middleName, phones, groupId, parents),
    createStudents: (_, { students }, { dataSources }) =>
      dataSources.students.createMany(students),
  },
}
