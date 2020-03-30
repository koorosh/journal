import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`
  
  input ParentInput {
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
    parents: [ParentInput]
  }

  type Student {
    id: ID!
    person: Person!
    group: Group
    parents: [Person]
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
      parents: [ParentInput]
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
