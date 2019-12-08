import uuid from 'uuid'

import SqlDatasource from './sql-datasource'
import { Attendance, WithoutId } from '../types'

export class AttendanceDatasource extends SqlDatasource {
  async create({groupId, absentStudentIds, lessonNo, date, subjectId}: WithoutId<Attendance>) {
    const attendanceId = uuid()

    return this.db.transaction(async (trx) => {
      await trx.table('attendances').insert({
        id: attendanceId,
        group_id: groupId,
        lesson_no: lessonNo,
        subject_id: subjectId,
        date
      })

      const absentStudentsRecords = absentStudentIds.map(studentId => ({
        id: uuid(),
        attendance_id: attendanceId,
        student_id: studentId,
      }))

      await trx.table('absent_students')
        .insert(absentStudentsRecords)

      return {
        id: attendanceId
      }
    })
  }
}
