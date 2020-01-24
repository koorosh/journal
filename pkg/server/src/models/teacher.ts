import { Schema, model, Document, Types } from 'mongoose'
import { Person } from './person'
import uuid from 'uuid'

const TeachersSchema = new Schema({
  person: { type: Schema.Types.ObjectId, ref: 'Persons' },
  positions: [{ type: Schema.Types.String }]
}, {
  toObject: {
    virtuals: true,
  }
})

function populateModel() {
  this.populate('person')
}

TeachersSchema.pre('find', populateModel)
TeachersSchema.pre('findOne', populateModel)
TeachersSchema.pre('findOneAndUpdate', populateModel)

TeachersSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export type TeacherPosition = 'teacher' | 'class_adviser' | 'director'

export interface Teacher extends Document {
  id: string
  person: Person
  positions: TeacherPosition[]
}

export const TeachersModel = model<Teacher>('Teachers', TeachersSchema)