import { Schema, model, Document, Types } from 'mongoose'
import { Person } from './person'
import { Group } from './group'
import { modelNames } from './model-names'

export interface Student extends Document {
  id: string
  person: Person
  group: Group
}

const StudentsSchema = new Schema({
  person: { type: Schema.Types.ObjectId, ref: modelNames.persons }
}, {
  toObject: {
    virtuals: true,
  }
})

StudentsSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

function preHook() {
  this.populate('person')
}

StudentsSchema.pre('find', preHook)
StudentsSchema.pre('findOne', preHook)
StudentsSchema.pre('findOneAndUpdate', preHook)

StudentsSchema.virtual('group', {
  ref: 'Groups',
  localField: '_id',
  foreignField: 'students',
  justOne: true,
})

export default StudentsSchema