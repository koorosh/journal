import { Schema, Document, Types } from 'mongoose'

export interface Organization extends Document {
  id: string
  name: string
  shortName: string
  tenantId: string
}

const OrganizationsSchema = new Schema({
  name: { type: String },
  shortName: { type: String },
  tenantId: { type: String },
}, {
  toObject: {
    virtuals: true,
  }
})

OrganizationsSchema.index({ name: 1 }, { unique: true })

OrganizationsSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export default OrganizationsSchema
