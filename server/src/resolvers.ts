import {GraphQLResolverMap} from 'apollo-graphql'

import {Context} from './types'

const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    students: (_, __, { dataSources }) => dataSources.students.selectAll(),
    student: (_, { id }, { dataSources }) => dataSources.students.findById(id),
    groups: (_, __, { dataSources }) => dataSources.groups.selectAll(),
    group: (_, { id }, { dataSources }) => dataSources.groups.findById(id),
  },
  Mutation: {
    createStudent: (_, student, { dataSources }) => dataSources.students.create(student),
    createGroup: (_, group, { dataSources }) => dataSources.groups.create(group),
  }
}

export default resolvers
