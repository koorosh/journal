import { gql } from 'apollo-server'

const typeDefs = gql`
  type Query {
    students: [Student]
    student(id: ID!): Student
    studentsInGroup(groupId: ID!): [Student]
    groups: [Group]
    group(id: ID!): Group
    groupsByYear(year: Int!): [Group]
    groupsThisYear: [Group]
    subjects: [Subject]
  }

  scalar Date
  
  type User {
    id: ID!
    email: String!
  }

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    phone: String
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

  type Mutation {
    createStudent(
      firstName: String!
      lastName: String!
      phone: String
    ): Student

    createGroup(
      name: String!
      year: Int!
    ): Group
    
    createAttendance(
      groupId: ID!
      subjectId: ID!
      lessonNo: Int!
      date: Date!
      absentStudentIds: [ID]
    ): AttendanceResponse
  }

  type AttendanceResponse {
    id: String!
  }
#  type AttendanceResponse {
#    success: Boolean!
#    message: String
#    students: [Student]
#  }
`

export default typeDefs
