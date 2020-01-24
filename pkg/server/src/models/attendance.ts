import { Schema, model, Document, Types } from 'mongoose'
import uuid from 'uuid'

import { Lesson } from './lesson'
import { Student } from './student'

const AttendanceSchema = new Schema({
  order: { type: Number },
  reason: { type: String },
  student: { type: Schema.Types.ObjectId, ref: 'Students' },
  lesson: { type: Schema.Types.ObjectId, ref: 'Lessons' },
}, {
  toObject: {
    virtuals: true,
  }
})

function populateModel() {
  this.populate('lesson')
  this.populate('student')
}

AttendanceSchema.pre('find', populateModel)
AttendanceSchema.pre('findOne', populateModel)
AttendanceSchema.pre('findOneAndUpdate', populateModel)

AttendanceSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export type AttendanceReason = 'illness' | 'important' | 'no_reason'

export interface Attendance {
  id: string
  reason?: AttendanceReason
  student: Student
  lesson: Lesson
}

export const AttendancesModel = model<Attendance & Document>('Attendances', AttendanceSchema)
