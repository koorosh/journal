import { gql } from 'apollo-server'

const typeDefs = gql`
  type Query {
    students: [Student]
    persons: [Person]
    student(id: ID!): Student
    person(id: ID!): Person
    studentsInGroup(groupId: ID!): [Student]
    groups: [Group]
    group(id: ID!): Group
    groupsByYear(year: Int!): [Group]
    groupsThisYear: [Group]
    subjects: [Subject]
    teachers: [Teacher]
    currentTeacher: Teacher
    parentsByStudentId(studentId: ID!): [Person]
    attendancesByGroupIdAndDate(groupId: ID!, date: Date!): [Attendance]
    lessonsByTeacher(teacherId: ID!, date: Date!): [Lesson]
    lesson(id: ID!): Lesson
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
    parents: [Parent]
  }

  type Student {
    id: ID!
    person: Person!
    group: Group
  }

  type Group {
    id: ID!
    name: String!
    year: Int!
    students: [Student]
  }
  
  type Lesson {
    id: ID!
    subject: Subject
    teacher: Teacher
    group: Group
    date: Date
    order: Int
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
  
  type Attendance {
    id: ID!
    student: Student!
    lesson: Lesson!
    reason: String
  }
  
  input CreateAttendancePayload {
    lessonId: ID!
    studentId: ID!
    reason: String
  }

  type Mutation {
    createStudent(
      firstName: String!
      lastName: String!
      phone: String
      groupId: ID
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
    
    addStudentToGroup(
      groupId: ID!
      studentId: ID!
    ): Group
    
    createSubject(
      name: String!
    ): Subject
    
    initUserAccessCode(personId: ID!): Boolean
    
    createLesson(
      subjectId: ID!
      groupId: ID!
      teacherId: ID!
      order: Int!
      date: Date!
    ): Lesson
    
    createAttendance(
      attendance: CreateAttendancePayload!
    ): Attendance
    
    createBatchAttendances(
      attendances: [CreateAttendancePayload]!
    ): [Attendance]
  }

  type Response {
    id: String!
  }
`

export default typeDefs
