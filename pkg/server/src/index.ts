import { ApolloServer } from 'apollo-server'

import typeDefs from './schema'
import {
  AttendanceDataSource,
  LessonDataSource,
  GroupDataSource,
  ParentDataSource,
  PersonDataSource,
  Publisher,
  StudentDataSource,
  SubjectDataSource,
  TeacherDataSource
} from './datasources'
import resolvers from './resolvers'
import { connectToDb } from './db'

connectToDb().catch(console.error)

const port = process.env.PORT

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    students: new StudentDataSource(),
    groups: new GroupDataSource(),
    subjects: new SubjectDataSource(),
    attendance: new AttendanceDataSource(),
    parents: new ParentDataSource(),
    persons: new PersonDataSource(),
    publisher: new Publisher(),
    lessons: new LessonDataSource(),
    teachers: new TeacherDataSource(),
  }),
})

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})

const gracefulShutdown = async () => {
  await server.stop()
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)