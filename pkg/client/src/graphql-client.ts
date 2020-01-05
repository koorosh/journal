import ApolloClient from 'apollo-boost'

const serverPort = process.env.REACT_APP_SERVER_PORT || 8090
const serverHost = process.env.REACT_APP_SERVER_HOST || window.location.hostname
const serverProtocol = process.env.REACT_APP_SERVER_PROTOCOL || window.location.protocol

const client = new ApolloClient({
  uri: `${serverProtocol}//${serverHost}:${serverPort}/graphql`,
})

export default client