import { Student } from './student'

export interface Group {
  id: string
  name: string
  year: number
  students: Student[]
}
