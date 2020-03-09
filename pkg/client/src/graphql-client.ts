import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ErrorResponse, onError } from 'apollo-link-error'

import history from './history'

const graphqlPath = process.env.REACT_APP_GRAPHQL_PATH
const graphqlServerUrl = `${process.env.REACT_APP_SERVER_URL}${graphqlPath}`

const cache = new InMemoryCache()

const errorLink = onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  (graphQLErrors || []).forEach(err => {
    switch (err.extensions?.code) {
      case 'UNAUTHENTICATED':
        history.push('/login')
    }
  })
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})

const httpLink = createHttpLink({
  uri: graphqlServerUrl,
  credentials: 'same-origin'
})

const client = new ApolloClient({
  cache,
  link: errorLink.concat(authLink).concat(httpLink),
})

/**
 * Initial cache state
 * Define fields which has to be cached
 **/
cache.writeData({
  data: {
    currentTeacherId: {
      __typename: 'currentTeacher',
      id: null
    },
  },
})

export default client