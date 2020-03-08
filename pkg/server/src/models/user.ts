import { Schema, model, Document } from 'mongoose'
import { Person } from './person'
import { Organization } from './organization'

export type UserRoles = 'principal' | 'teacher' | 'groupManager' | 'god' | 'admin'
export type UserStatuses = 'initiated' | 'active' | 'suspended'

export interface User extends Document {
  id: string
  phone: string
  password: string
  roles: UserRoles[]
  organization: Organization
  isActive: boolean
  status: UserStatuses
  person?: Person
}

const UsersSchema = new Schema({
  phone: {
    type: String,
    required : true,
    unique : true
  },
  password: { type: String, required : true },
  roles: [{ type: String }],
  status: { type: String },
  isActive: [{ type: Boolean }],
  organization: { type: Schema.Types.ObjectId, ref: 'Organizations' },
  person: { type: Schema.Types.ObjectId, ref: 'Persons' },
}, {
  toObject: {
    virtuals: true,
  }
})

export const UsersModel = model<User>('Users', UsersSchema)