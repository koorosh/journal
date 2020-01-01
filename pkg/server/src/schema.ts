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
  
  type Subject {
    id: ID!
    name: String
  }
  
  type Parent {
    id: ID!
    person: Person!
    child: Person!
    relationship: String!
  }
  
  input AbsentStudentReport {
    studentId: ID!
    subjectId: ID!
    groupId: ID!
    lessonNo: Int!
    absenceReason: Int!
    date: Date!
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

    createGroup(
      name: String!
      year: Int!
    ): Group
    
    initUserAccessCode(personId: ID!): Boolean

    createStudentAttendanceReport(attendanceReport: AbsentStudentReport!): Response
    
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
