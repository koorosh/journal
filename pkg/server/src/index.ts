import { ApolloServer } from 'apollo-server-koa'
import Koa from 'koa'
import cors from '@koa/cors'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import jsonwebtoken from 'jsonwebtoken'

import auth from './auth'
import { health } from './api/internal'

import {
  AttendanceDataSource,
  LessonDataSource,
  GroupDataSource,
  ParentDataSource,
  PersonDataSource,
  StudentDataSource,
  SubjectDataSource,
  TeacherDataSource,
  UserDataSource,
  OrganizationDataSource,
} from './datasources'
import schema from './schema/index'
import { jwt, responseTime } from './middlewares'
import { GRAPHQL_PATH } from './config'
import { AuthenticationError } from 'apollo-server'
import { Context } from './types'
import { initModels } from './models'

const port = process.env.PORT

initModels()

const app = new Koa();

app
  .use(cors())
  .use(bodyParser())
  .use(responseTime)
  .use(logger())
  .use(jwt.unless({ path: [/^\/auth/, /^\/graphql/, /^\/api\/internal/] }))
  .use(auth.login.routes())
  .use(auth.login.allowedMethods())
  .use(auth.register.routes())
  .use(auth.register.allowedMethods())
  .use(auth.changePassword.routes())
  .use(auth.changePassword.allowedMethods())
  .use(auth.rootUser.routes())
  .use(auth.rootUser.allowedMethods())
  .use(health.routes())
  .use(health.allowedMethods())

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
    lessons: new LessonDataSource(),
    teachers: new TeacherDataSource(),
    users: new UserDataSource(),
    organizations: new OrganizationDataSource(),
  }),
  context: async ({ dataSources, ctx}: Context) => {
    const { headers, body } = ctx.request

    const publicOperations = [
      'organizations',
    ]

    const token = (headers.authorization || '').replace('Bearer ', '')
    const isPublicOp = publicOperations.includes(body.operationName)

    if (isPublicOp) {
      return
    }

    try {
      const user = jsonwebtoken.verify(token, process.env.JWT_SECRET)
      return { user }
    } catch (e) {
      throw new AuthenticationError('you must be logged in')
    }
  }
})

server.applyMiddleware({ app, path: GRAPHQL_PATH });

app.listen({ port }, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}\nGraphQL URL: http://localhost:${port}${server.graphqlPath}`)
})

const gracefulShutdown = async () => {
  await server.stop()
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
