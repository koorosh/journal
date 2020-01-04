import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
  uri: 'http://localhost:8090/graphql',
})

export default client