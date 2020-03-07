import { Schema, model, Document, Types } from 'mongoose'

export type UserRoles = 'principal' | 'teacher' | 'groupManager'

export interface User extends Document {
  id: string
  phone: string
  password: string
  salt: string
  roles: UserRoles[]
}

const UsersSchema = new Schema({
  phone: { type: String },
  password: { type: String },
  salt: { type: String },
  roles: [{ type: String }],
}, {
  toObject: {
    virtuals: true,
  }
})

export const UsersModel = model<User>('Users', UsersSchema)