import {GraphQLResolverMap} from 'apollo-graphql'

import { Attendance, Context } from './types'

const resolvers: GraphQLResolverMap<Context> = {
  Query: {
    students: (_, __, { dataSources }) => dataSources.students.selectAll(),
    student: (_, { id }, { dataSources }) => dataSources.students.findById(id),
    studentsInGroup: (_, { groupId }, { dataSources }) => dataSources.students.studentsInGroup(groupId),
    groups: (_, __, { dataSources }) => dataSources.groups.selectAll(),
    group: (_, { id }, { dataSources }) => dataSources.groups.findById(id),
    groupsByYear: (_, { year }, { dataSources }) => dataSources.groups.findByYear(year),
    groupsThisYear: (_, { year }, { dataSources }) => dataSources.groups.groupsThisYear(),
    subjects: (_, __, { dataSources }) => dataSources.subjects.selectAll(),
  },
  Mutation: {
    createStudent: (_, student, { dataSources }) =>
      dataSources.students.create(student)
        .then(studentId => ({
          ...student,
          id: studentId,
        })),
    createGroup: (_, group, { dataSources }) =>
      dataSources.groups.create(group)
        .then(groupId => ({
          ...group,
          id: groupId,
        })),
    createAttendance: (_, attendance: Attendance, { dataSources }) =>
      dataSources.attendance.create(attendance)
  }
}

export default resolvers
