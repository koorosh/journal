import { Schema, model, Document, Types } from 'mongoose'
import { Student } from './student'

const GroupsSchema = new Schema({
  name: { type: String },
  year: { type: Number },
  students: [ {
    type: Schema.Types.ObjectId,
    ref: 'Students'
  }]
}, {
  toObject: {
    virtuals: true,
  }
})

GroupsSchema.index({ name: 1, year: 1 }, { unique: true })
GroupsSchema.index({ name: 1, year: 1, students: 1 }, { unique: true })

function populateModel() {
  this.populate('students')
}

GroupsSchema.pre('find', populateModel)
GroupsSchema.pre('findOne', populateModel)
GroupsSchema.pre('findOneAndUpdate', populateModel)

GroupsSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

GroupsSchema.statics.findById = function (id: string) {
  return this.findOne({ _id: Types.ObjectId(id) })
}

export interface Group extends Document {
  id: string
  name: string
  year: number
  students: Student
}

export const GroupsModel = model<Group>('Groups', GroupsSchema)