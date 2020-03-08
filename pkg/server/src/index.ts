import { AuthenticationError } from 'apollo-server'
import { ApolloServer } from 'apollo-server-koa'
import Koa from 'koa'
import cors from '@koa/cors'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'

import auth from './auth'

import {
  AttendanceDataSource,
  LessonDataSource,
  GroupDataSource,
  ParentDataSource,
  PersonDataSource,
  Publisher,
  StudentDataSource,
  SubjectDataSource,
  TeacherDataSource,
  UserDataSource,
  OrganizationDataSource,
} from './datasources'
import schema from './schema/index'
import { connectToDb } from './db'
import { Context } from './types'
import { jwt, responseTime } from './middlewares'

const dbUrl = process.env.MONGODB_URI
const port = process.env.PORT

const app = new Koa();

app
  .use(cors())
  .use(bodyParser())
  .use(responseTime)
  .use(logger())
  .use(jwt.unless({ path: [/^\/auth/, /^\/graphql/] }))
  .use(auth.login.routes())
  .use(auth.login.allowedMethods())
  .use(auth.register.routes())
  .use(auth.register.allowedMethods())
  .use(auth.changePassword.routes())
  .use(auth.changePassword.allowedMethods())

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
    organizations: new OrganizationDataSource(),
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