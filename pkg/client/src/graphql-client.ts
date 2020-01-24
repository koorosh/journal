import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'

const serverUrl = process.env.REACT_APP_SERVER_URL

const cache = new InMemoryCache()
const client = new ApolloClient({
  cache,
  uri: serverUrl,
})

cache.writeData({
  data: {
    currentTeacherId: {
      __typename: 'currentTeacher',
      id: null
    },
  },
})

export default client