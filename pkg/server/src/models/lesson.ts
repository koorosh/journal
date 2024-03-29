import { Schema, model, Document, Types } from 'mongoose'
import { Group } from './group'
import { Teacher } from './teacher'
import { Subject } from './subject'
import { modelNames } from './model-names'

const LessonsSchema = new Schema({
  order: { type: Number },
  date: { type: Date, default: Date.now },
  group: { type: Schema.Types.ObjectId, ref: modelNames.groups },
  subject: { type: Schema.Types.ObjectId, ref: modelNames.subjects },
  teacher: { type: Schema.Types.ObjectId, ref: modelNames.teachers },
  lastAttendanceCheck: { type: Date },
}, {
  toObject: {
    virtuals: true,
  }
})

function preHook() {
  this.populate('group')
  this.populate('subject')
  this.populate('teacher')
}

async function postHook(doc) {
  await doc.populate('group')
    .populate('subject')
    .populate('teacher')
    .execPopulate()
}

LessonsSchema.pre('find', preHook)
LessonsSchema.pre('findOne', preHook)
LessonsSchema.pre('findOneAndUpdate', preHook)
LessonsSchema.post('save', postHook)

LessonsSchema.virtual('id')
  .get(function() { return this._id.toString() })
  .set(function (id: string) {
    this._id = Types.ObjectId(id)
  })

export interface Lesson extends Document {
  id: string
  order: number
  date: Date
  group: Group
  teacher: Teacher
  subject: Subject
  lastAttendanceCheck?: Date
}

export default LessonsSchema