import { ApolloServer } from 'apollo-server'

import typeDefs from './schema'
import {
  AbsenceDatasource, ClientDatasource,
  GroupDatasource,
  ParentDatasource,
  PersonDatasource,
  Publisher,
  StudentDatasource,
  SubjectDatasource
} from './datasources'
import resolvers from './resolvers'

const port = process.env.PORT

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    students: new StudentDatasource(),
    groups: new GroupDatasource(),
    subjects: new SubjectDatasource(),
    absence: new AbsenceDatasource(),
    parents: new ParentDatasource(),
    persons: new PersonDatasource(),
    publisher: new Publisher(),
    client: new ClientDatasource(),
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