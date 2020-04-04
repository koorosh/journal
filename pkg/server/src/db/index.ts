import mongoose, { Connection, ConnectionOptions } from 'mongoose'

const host = process.env.MONGODB_HOST
const user = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD
const uriFormat = process.env.MONGODB_URI_FORMAT
const authSource = process.env.MONGODB_AUTH_SOURCE
const isProduction = process.env.NODE_ENV === 'production'
export const SYSTEM_TENANT_ID = process.env.MONGODB_DATABASE

const dbOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  // it was necessary to manage connection to MongoDb Atlas cluster
  authSource,
}

const connectionsCache = new Map<string, mongoose.Connection>()

export const getConnectionByTenantId = (tenantId: string = SYSTEM_TENANT_ID) => {
  if (connectionsCache.has(tenantId)) {
    return connectionsCache.get(tenantId)
  }
  const connection = mongoose.createConnection(
    `${uriFormat}://${user}:${password}@${host}/${tenantId}${isProduction ? '?retryWrites=true&w=majority' : ''}`,
    dbOptions
  )
  connectionsCache.set(tenantId, connection)
  return connection
}

export function checkConnection(): boolean {
  return mongoose.connection.readyState === mongoose.connection.states.connected
}