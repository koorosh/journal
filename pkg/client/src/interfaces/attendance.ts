import { Lesson } from './lesson'
import { Student } from './student'

export type AttendanceReason = 'illness' | 'important' | 'no_reason'

export interface Attendance {
  id: string
  lesson: Lesson
  student: Student
  reason?: AttendanceReason
}