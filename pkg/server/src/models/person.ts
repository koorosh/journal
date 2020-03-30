import { Schema, Document, Types } from 'mongoose'

export interface Person extends Document {
  id: string
  firstName: string
  lastName: string
  middleName: string
  phones: string[]
}

const PersonsSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  phones: [{ type: String }],
}, {
  toObject: {
    virtuals: true,
  }
})

PersonsSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export default PersonsSchema