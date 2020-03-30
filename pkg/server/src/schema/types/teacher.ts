import { gql } from 'apollo-server-koa'
import { GraphQLResolverMap } from 'apollo-graphql'
import { Context } from '../../types'

export const typeDef = gql`

  type Teacher {
    id: ID!
    person: Person!
  }
  
  extend type Query {
    teachers: [Teacher]
    currentTeacher: Teacher
  }

  extend type Mutation {
    createTeacher(
      firstName: String!
      lastName: String!
      middleName: String!
      phones: [String]
    ): Teacher
    
    createTeacherAsPerson(
      personId: ID!
    ): Teacher
  }
`

export const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    teachers: (_, __, { dataSources }) =>
      dataSources.teachers.selectAll(),
    currentTeacher: (_, __, { dataSources, user }) =>
      dataSources.teachers.findTeacherByUserId(user.id),
  },
  Mutation: {
    createTeacher: async (_, { firstName, lastName, middleName, phones }, { dataSources }) => {
      const person = await dataSources.persons.create(firstName, lastName, middleName, phones)
      return dataSources.teachers.createAsPerson(person.id)
    },
    createTeacherAsPerson: (_, { personId }, { dataSources }) =>
      dataSources.teachers.createAsPerson(personId),
  },
}
