import uuid from 'uuid'

import SqlDatasource from './sql-datasource'
import { Absence, WithoutId } from '../types'

export class AbsenceDatasource extends SqlDatasource {
  async createAbsentStudentRecord({
                               groupId,
                               studentId,
                               lessonNo,
                               date,
                               subjectId,
                               reason
                             }: WithoutId<Absence>) {
    const absenceId = uuid()
    await this.db
      .table('absent_students')
      .insert({
        id: absenceId,
        student_id: studentId,
        group_id: groupId,
        lesson_no: lessonNo,
        subject_id: subjectId,
        date,
        reason
      })
    return {
      id: absenceId
    }
  }

  async getReportsByDateAndGroup(date: Date, groupId: string, attendanceReportIds: string[]) {
    const reports = await this.db
      .select([
        'students.id AS studentId',
        'absent_students.lesson_no AS lessonNo',
        'absent_students.date',
        'absent_students.reason AS absenceReason',
        'groups.name AS group',
        'persons.first_name AS studentFirstName',
        'persons.last_name AS studentLastName',
        'subjects.name AS subject',
      ])
      .table('absent_students')
      .innerJoin('students', 'absent_students.student_id', 'students.id')
      .innerJoin('groups', 'absent_students.group_id', 'groups.id')
      .innerJoin('subjects', 'absent_students.subject_id', 'subjects.id')
      .innerJoin('persons', 'students.person_id', 'persons.id')
      .whereIn('absent_students.id', attendanceReportIds)
      .andWhere({
        'absent_students.date': date,
        'absent_students.group_id': groupId
      })

    return reports
  }
}
