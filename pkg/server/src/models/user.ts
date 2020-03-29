import { Schema, Document, Types } from 'mongoose'
import { Person } from './person'
import { modelNames } from './model-names'
import { dbModelFactory } from './db-model-factory'
import { Organization } from './organization'

export type UserRoles = 'principal' | 'teacher' | 'groupManager' | 'god' | 'admin'
export type UserStatuses = 'initiated' | 'active' | 'suspended'

const OrganizationModel = dbModelFactory('organizations')

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
  organization: {
    type: Schema.Types.ObjectId,
    ref: OrganizationModel
  },
  person: { type: Schema.Types.ObjectId, ref: modelNames.persons },
}, {
  toObject: {
    virtuals: true,
  }
})

UsersSchema.index({ person: 1 }, { unique: true })

function populateModel() {
  this.populate('person')
}

UsersSchema.pre('find', populateModel)
UsersSchema.pre('findOne', populateModel)
UsersSchema.pre('findOneAndUpdate', populateModel)

UsersSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export default UsersSchema