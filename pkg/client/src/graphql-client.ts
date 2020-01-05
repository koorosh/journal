import ApolloClient from 'apollo-boost'

const serverUrl = process.env.REACT_APP_SERVER_URL

const client = new ApolloClient({
  uri: serverUrl,
})

export default client