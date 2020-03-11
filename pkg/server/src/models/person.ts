import { Schema, model, Document, Types } from 'mongoose'
import { Parent } from './parent'

export interface Person extends Document {
  id: string
  firstName: string
  lastName: string
  phone: string
  parents?: Parent[]
}

const PersonsSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  parents: [{ type: Schema.Types.ObjectId, ref: 'Parents' }],
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

export const PersonsModel = model<Person>('Persons', PersonsSchema)