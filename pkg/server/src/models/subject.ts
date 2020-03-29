import { Schema, Document, Types } from 'mongoose'

const SubjectsSchema = new Schema({
  name: { type: String },
}, {
  toObject: {
    virtuals: true,
  }
})

SubjectsSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export interface Subject extends Document {
  id: string
  name: string
}

export default SubjectsSchema