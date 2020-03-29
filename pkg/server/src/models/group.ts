import { Schema, Document, Types } from 'mongoose'
import { Student } from './student'
import { modelNames } from './model-names'

export interface Group extends Document {
  id: string
  name: string
  year: number
  students: Student
}

const GroupsSchema = new Schema({
  name: { type: String },
  year: { type: Number },
  students: [ {
    type: Schema.Types.ObjectId,
    ref: modelNames.students
  }]
}, {
  toObject: {
    virtuals: true,
  }
})

GroupsSchema.index({ name: 1, year: 1 }, { unique: true })
GroupsSchema.index({ name: 1, year: 1, students: 1 }, { unique: true })

function populateModel() {
  this.populate(modelNames.students)
}

GroupsSchema.pre('find', populateModel)
GroupsSchema.pre('findOne', populateModel)
GroupsSchema.pre('findOneAndUpdate', populateModel)

GroupsSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export default GroupsSchema
