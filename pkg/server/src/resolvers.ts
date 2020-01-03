import { GraphQLResolverMap } from 'apollo-graphql'

import { Context } from './types'
import { Queues } from './config/amqp'

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
    parentsByStudentId: (_, { studentId }, { dataSources }) =>
      dataSources.parents.getParentsByStudentId(studentId),
    person: (_, { id }, { dataSources }) => dataSources.persons.findById(id),
    absenceReport: (_, { id }, { dataSources }) => dataSources.absence.findById(id),
  },
  Mutation: {
    createStudent: (_, student, { dataSources }) =>
      dataSources.students.create(student),
    createParent: (_, { firstName, lastName, phone, relationship, childPersonId }, { dataSources }) =>
      dataSources.parents.create(firstName, lastName, phone, childPersonId, relationship),
    createGroup: (_, group, { dataSources }) =>
      dataSources.groups.create(group)
        .then(groupId => ({
          ...group,
          id: groupId,
        })),
    initUserAccessCode: (_, { personId }, { dataSources }) =>
      dataSources.publisher.publish(Queues.USER_ACCESS_CODE, { personId }),
    createStudentAttendanceReport: (_, { attendanceReport }, { dataSources }) =>
      dataSources.absence.createAbsentStudentRecord(attendanceReport),
    sendStudentAttendanceReport: async (_, {date, groupId, attendanceReportIds}, { dataSources }) => {
      await Promise.all(attendanceReportIds.map(reportId => dataSources.publisher.publish(Queues.ABSENT_STUDENT, { reportId })))
    }
  }
}

export default resolvers
