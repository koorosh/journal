import { gql } from 'apollo-server'

const typeDefs = gql`
  type Query {
    students: [Student]
    student(id: ID!): Student
    person(id: ID!): Person
    studentsInGroup(groupId: ID!): [Student]
    groups: [Group]
    group(id: ID!): Group
    groupsByYear(year: Int!): [Group]
    groupsThisYear: [Group]
    subjects: [Subject]
    parentsByStudentId(studentId: ID!): [Person]
    absenceReport(id: ID!): AbsentReport
    absenceReportExt(id: ID!): AbsentReportExt
    getReportsByDateAndGroup(groupId: ID!, date: Date!): [ReportsByDateAndGroupResponse]
    lessonsByTeacher(teacherId: ID!, date: Date): [Lesson]
  }

  scalar Date
  
  type User {
    id: ID!
    email: String!
  }
  
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    phone: String
  }

  type Student {
    id: ID!
    person: Person!
  }

  type Group {
    id: ID!
    name: String!
    year: Int!
  }
  
  type Lesson {
    id: ID!
    subject: Subject
    teacher: Teacher
    group: Group
    date: Date
    orderNo: Int
  }
  
  type Subject {
    id: ID!
    name: String
  }
  
  type Parent {
    id: ID!
    person: Person!
  }
  
  type Teacher {
    id: ID!
    person: Person!
  }
  
  type AbsentReport {
    id: ID!
    studentId: ID!
    subjectId: ID!
    groupId: ID!
    lessonNo: Int!
    absenceReason: Int!
    date: Date!
  }
  
  type AbsentReportExt {
    id: ID!
    student: Student!
    subjectId: Subject
    groupId: Group!
    lessonNo: Int
    absenceReason: Int!
    date: Date!
    group: Group!
    subject: Subject!
  }
  
  type ReportsByDateAndGroupResponse {
    id: ID!
    studentId: ID!
    lessonNo: Int!
    date: Date!
    absenceReason: Int!
    groupId: ID!
    groupName: String!
    studentFirstName: String!
    studentLastName: String!
    subjectId: ID
    subjectName: String
  }
  
  input AbsentStudentReport {
    studentId: ID!
    subjectId: ID!
    groupId: ID!
    lessonNo: Int!
    absenceReason: Int!
    date: Date!
  }
  
  input StudentAbsenceReasonMap {
    studentId: ID!
    absenceReason: Int!
  }
  
  input AbsentGroupReport {
    subjectId: ID!
    groupId: ID!
    lessonNo: Int!
    date: Date!
    absentStudentIds: [StudentAbsenceReasonMap]!
  }

  type Mutation {
    createStudent(
      firstName: String!
      lastName: String!
      phone: String
    ): Student
    
    createParent(
      firstName: String!
      lastName: String!
      phone: String
      relationship: String!
      childPersonId: ID!
    ): Parent
    
    createTeacher(
      firstName: String!
      lastName: String!
      phone: String
    ): Teacher

    createGroup(
      name: String!
      year: Int!
    ): Group
    
    initUserAccessCode(personId: ID!): Boolean

    createStudentAttendanceReport(attendanceReport: AbsentStudentReport!): Response

    createGroupAttendanceReport(attendanceReport: AbsentGroupReport!): Response
    
    createLesson(
      subjectId: ID!
      groupId: ID!
      teacherId: ID!
      orderNo: Int!
      date: Date!
    ): Lesson
    
    sendStudentAttendanceReport(
      date: Date!
      groupId: ID!
      attendanceReportIds: [ID]!
    ): Boolean
  }

  type Response {
    id: String!
  }
`

export default typeDefs
