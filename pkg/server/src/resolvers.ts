import { GraphQLResolverMap } from 'apollo-graphql'
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { startOfDay, parseISO, formatISO } from 'date-fns'

import { Context } from './types'

const resolverMap = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date without time',
    parseValue(isoDateString: string) {
      return startOfDay(parseISO(isoDateString))
    },
    serialize(value: Date) {
      return formatISO(value, { representation: 'date'})
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return startOfDay(parseISO(ast.value))
      }
      return null;
    },
  }),
};

const resolvers: GraphQLResolverMap<Context> = {
  ...resolverMap,
  Query: {
    students: (_, __, { dataSources }) => dataSources.students.selectAll(),
    student: (_, { id }, { dataSources }) => dataSources.students.findById(id),
    groups: (_, __, { dataSources }) => dataSources.groups.selectAll(),
    group: (_, { id }, { dataSources }) => dataSources.groups.findById(id),
    groupsByYear: (_, { year }, { dataSources }) => dataSources.groups.findByYear(year),
    groupsThisYear: (_, { year }, { dataSources }) => dataSources.groups.findByYear(new Date().getFullYear()),
    persons: (_, __, { dataSources }) => dataSources.persons.selectAll(),
    subjects: (_, __, { dataSources }) => dataSources.subjects.selectAll(),
    teachers: (_, __, { dataSources }) => dataSources.teachers.selectAll(),
    currentTeacher: (_, __, { dataSources }) => dataSources.teachers.currentTeacher(),
    attendancesByGroupIdAndDate: (_, { groupId, date }, { dataSources }) =>
      dataSources.attendance.findByGroupAndDate(groupId, date),
    person: (_, { id }, { dataSources }) => dataSources.persons.findById(id),
    lessonsByTeacher: (_, { teacherId, date }, { dataSources }) =>
      dataSources.lessons.findLessonsByTeacherAndDate(teacherId, date),
    lesson: (_, { id }, { dataSources }) => dataSources.lessons.findById(id),
  },
  Mutation: {
    createSubject: (_, { name }, { dataSources }) =>
      dataSources.subjects.create(name),
    createStudent: (_, { firstName, lastName, phone, groupId }, { dataSources }) =>
      dataSources.students.create(firstName, lastName, phone, groupId),
    createParent: (_, { firstName, lastName, phone, childPersonId }, { dataSources }) =>
      dataSources.parents.create(firstName, lastName, phone),
    createTeacher: (_, { firstName, lastName, phone }, { dataSources }) =>
      dataSources.teachers.create(firstName, lastName, phone),
    createGroup: (_, { name, year }, { dataSources }) =>
      dataSources.groups.create(name, year),
    addStudentToGroup: (_, { groupId, studentId }, { dataSources }) =>
      dataSources.groups.addStudent(groupId, studentId),
    createLesson: (_, { order, date, subjectId, groupId, teacherId }, { dataSources }) =>
      dataSources.lessons.create(date, order, subjectId, groupId, teacherId),
    createAttendance: (_, { attendance }, { dataSources }) =>
      dataSources.attendance.create(attendance.lessonId, attendance.studentId, attendance.reason),
    createBatchAttendances: (_, { attendances }, { dataSources }) =>
      dataSources.attendance.batchCreate(attendances),
    // initUserAccessCode: (_, { personId }, { dataSources }) =>
    //   dataSources.publisher.publish(Queues.USER_ACCESS_CODE, { personId }),
    // sendStudentAttendanceReport: async (_, {date, groupId, attendanceReportIds}, { dataSources }) => {
    //   await Promise.all(attendanceReportIds.map(reportId => dataSources.publisher.publish(Queues.ABSENT_STUDENT, { reportId })))
    // }
  }
}

export default resolvers
