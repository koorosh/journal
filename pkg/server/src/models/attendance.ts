import { Schema, model, Document, Types } from 'mongoose'

import { Lesson } from './lesson'
import { Student } from './student'

const AttendanceSchema = new Schema({
  lesson: { type: Schema.Types.ObjectId, ref: 'Lessons' },
  student: { type: Schema.Types.ObjectId, ref: 'Students' },
  reason: { type: String },
}, {
  toObject: {
    virtuals: true,
  }
})

function populateModel() {
  // this.populate('lesson')
  //   .populate('student')
  this.populate({
    path: 'lesson',
    populate: 'group subject teacher'
  })
  this.populate({
    path: 'student',
    populate: 'person'
  })
}

AttendanceSchema.pre('find', populateModel)
AttendanceSchema.pre('findOne', populateModel)
AttendanceSchema.pre('findOneAndUpdate', populateModel)

AttendanceSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

AttendanceSchema.query.byDate = function (date: Date) {
  this.populate('lesson')
  return this.where({
    'lesson.date': {
      $eq: date,
    }
  });
}

AttendanceSchema.query.byDateRange = function (from: Date, to: Date) {
  this.populate('lesson')
  return this.where({
    'lesson.date': {
      $gte: from,
      $lt: to
    }
  })
}

AttendanceSchema.query.byGroup = function (groupId: string) {
  this.populate('lesson')
  return this.populate('lesson')
    .where({
      'lesson.group': groupId
    })
}

AttendanceSchema.query.byGroupName = function (groupId: string) {
  return this.populate('lesson')
    .where({
      'lesson.group.name': groupId
    })
}

export type AttendanceReason = 'illness' | 'important' | 'no_reason'

export interface Attendance extends Document {
  id: string
  reason?: AttendanceReason
  student: Student
  lesson: Lesson

  byGroupName: (name: string) => Promise<Attendance>
}

export const AttendancesModel = model<Attendance>('Attendances', AttendanceSchema)
