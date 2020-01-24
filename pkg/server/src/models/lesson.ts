import { Schema, model, Document, Types } from 'mongoose'
import { Group } from './group'
import { Teacher } from './teacher'
import { Subject } from './subject'

const LessonsSchema = new Schema({
  order: { type: Number },
  date: { type: Date, default: Date.now },
  group: { type: Schema.Types.ObjectId, ref: 'Groups' },
  subject: { type: Schema.Types.ObjectId, ref: 'Subjects' },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teachers' },
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

export interface Lesson {
  order: number
  date: Date
  group: Group
  teacher: Teacher
  subject: Subject
}

export const LessonsModel = model<Lesson & Document>('Lessons', LessonsSchema)