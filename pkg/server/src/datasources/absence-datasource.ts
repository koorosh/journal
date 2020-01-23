import uuid from 'uuid'

import SqlDatasource from './sql-datasource'
import { Absence, WithoutId } from '../types'

export class AbsenceDatasource extends SqlDatasource {
  async createAbsentStudentRecord({
                                    lessonId,
                                    studentId,
                                    reason
                                  }: WithoutId<Absence>) {
    const absenceId = uuid()
    await this.db
      .table('absent_students')
      .insert({
        id: absenceId,
        student_id: studentId,
        lesson_id: lessonId,
        reason
      })
    return {
      id: absenceId
    }
  }

  async getReportsByDateAndGroup(date: Date, groupId: string) {
    const reports = await this.db
      .select([
        'absent_students.id AS id',
        'students.id AS studentId',
        'absent_students.lesson_no AS lessonNo',
        'absent_students.date',
        'absent_students.reason AS absenceReason',
        'groups.id AS groupId',
        'groups.name AS groupName',
        'persons.first_name AS studentFirstName',
        'persons.last_name AS studentLastName',
        'subjects.id AS subjectId',
        'subjects.name AS subjectName',
      ])
      .table('absent_students')
      .innerJoin('students', 'absent_students.student_id', 'students.id')
      .innerJoin('groups', 'absent_students.group_id', 'groups.id')
      .innerJoin('subjects', 'absent_students.subject_id', 'subjects.id')
      .innerJoin('persons', 'students.person_id', 'persons.id')
      .andWhere({
        'absent_students.date': date,
        'absent_students.group_id': groupId
      })

    return reports
  }

  async findById(id: string) {
    const record = await this.db
      .from('absent_students')
      .where('id', id)
      .first()

    const { student_id, group_id, subject_id, reason, lesson_no, date } = record
    return {
      id,
      subjectId: subject_id,
      studentId: student_id,
      groupId: group_id,
      absenceReason: reason,
      date,
      lessonNo: lesson_no
    }
  }
}
