import { Schema, model, Document, Types } from 'mongoose'
import { User } from './user'

const OrganizationsSchema = new Schema({
  name: { type: String },
  adminUser: {type: Schema.Types.ObjectId, ref: 'Users'}
}, {
  toObject: {
    virtuals: true,
  }
})

OrganizationsSchema.index({ name: 1 }, { unique: true })

function populateModel() {
  this.populate('adminUser')
}

OrganizationsSchema.pre('find', populateModel)
OrganizationsSchema.pre('findOne', populateModel)
OrganizationsSchema.pre('findOneAndUpdate', populateModel)

OrganizationsSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export interface Organization extends Document {
  id: string
  name: string
  adminUser: User
}

export const OrganizationsModel = model<Organization>('Organizations', OrganizationsSchema)