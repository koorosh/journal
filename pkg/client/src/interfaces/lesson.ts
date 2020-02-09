import { Group } from './group'
import { Subject } from './subject'
import { Teacher } from './teacher'

export interface Lesson {
  id: string
  order: number
  group: Group
  subject: Subject
  teacher: Teacher
  date: Date
  lastAttendanceCheck?: Date
}
