import { ApolloServer } from 'apollo-server'

import typeDefs from './schema'
import {GroupDatasource, StudentDatasource} from './datasources'
import resolvers from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    students: new StudentDatasource(),
    groups: new GroupDatasource(),
  }),
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
