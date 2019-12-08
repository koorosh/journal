import { ApolloServer } from 'apollo-server'

import typeDefs from './schema'
import { AttendanceDatasource, GroupDatasource, StudentDatasource, SubjectDatasource } from './datasources'
import resolvers from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    students: new StudentDatasource(),
    groups: new GroupDatasource(),
    subjects: new SubjectDatasource(),
    attendance: new AttendanceDatasource(),
  }),
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
