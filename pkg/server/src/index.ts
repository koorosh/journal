import { ApolloServer } from 'apollo-server-koa'
import Koa from 'koa'
import jwt from 'koa-jwt'
import cors from '@koa/cors'

import {
  AttendanceDataSource,
  LessonDataSource,
  GroupDataSource,
  ParentDataSource,
  PersonDataSource,
  Publisher,
  StudentDataSource,
  SubjectDataSource,
  TeacherDataSource, UserDataSource
} from './datasources'
import schema from './schema/index'
import { connectToDb } from './db'
import { Context } from './types'

const dbUrl = process.env.MONGODB_URI
const port = process.env.PORT

const app = new Koa();

app
  .use(cors())
  .use(jwt({
    secret: process.env.JWT_SECRET,
    passthrough: true
  }));

// app.use(koaBody())

connectToDb(dbUrl).catch(console.error)

const server = new ApolloServer({
  debug: true,
  introspection: true,
  schema,
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
    users: new UserDataSource(),
  }),
  context: ({ dataSources, ctx}: Context) => {
    return {
      user: ctx.user,
    }
  }
})

server.applyMiddleware({ app });

app.listen({ port }, () => {
  console.log(`🚀 Server ready at: localhost:${port}${server.graphqlPath}`)
})

const gracefulShutdown = async () => {
  await server.stop()
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)