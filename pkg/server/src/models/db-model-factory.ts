import { Document, Model, Schema } from 'mongoose'
import AttendanceSchema from './attendance'
import GroupsSchema from './group'
import LessonsSchema from './lesson'
import OrganizationsSchema from './organization'
import ParentsSchema from './parent'
import PersonsSchema from './person'
import StudentsSchema from './student'
import SubjectsSchema from './subject'
import TeachersSchema from './teacher'
import UsersSchema from './user'

import { getConnectionByTenantId, SYSTEM_TENANT_ID } from '../db'
import { Models } from './models'

const schemas = new Map<Models, Schema>([
  ['attendances', AttendanceSchema],
  ['groups', GroupsSchema],
  ['lessons', LessonsSchema],
  ['organizations', OrganizationsSchema],
  ['parents', ParentsSchema],
  ['persons', PersonsSchema],
  ['students', StudentsSchema],
  ['subjects', SubjectsSchema],
  ['teachers', TeachersSchema],
  ['users', UsersSchema],
])

const connectionsCache = new Map<string, boolean>()

export const initModels = (tenantId: string = 'journal') => {
  const connection = getConnectionByTenantId(tenantId)
  schemas.forEach((schema, name) => connection.model(name, schema))
}

export const dbModelFactory = <T extends Document>(modelName: Models, tenantId: string = SYSTEM_TENANT_ID): Model<T> => {
  const connection = getConnectionByTenantId(tenantId)
  if (!connectionsCache.has(tenantId)) {
    schemas.forEach((schema, name) => connection.model(name, schema))
  }
  return connection.models[modelName]
}