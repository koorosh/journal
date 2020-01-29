import { DataSource } from 'apollo-datasource'

import { AttendancesModel, Attendance, AttendanceReason, LessonsModel } from '../models'

export class AttendanceDataSource extends DataSource {
  async findById(id: string): Promise<Attendance> {
    const attendance = await AttendancesModel.findById(id)
    return attendance.toObject()
  }

  async create(
    studentId: string,
    lessonId: string,
    reason?: AttendanceReason,
  ): Promise<Attendance> {
    const model = new AttendancesModel({
      reason,
      lesson: lessonId,
      student: studentId
    })

    const attendance = await model.save()
    return attendance.toObject()
  }

  async batchCreate(attendances: any[]) {
    return Promise.all(attendances.map(attendance =>
      this.create(attendance.lessonId, attendance.studentId, attendance.reason))
    )
  }

  async findByGroupAndDate(groupId: string, date: Date): Promise<Attendance[]> {
    const lessons = await LessonsModel.find({
      group: groupId,
      date
    })
    const attendances = await AttendancesModel
      .find({
        lesson: {
          $in: lessons.map(lesson => lesson._id)
        }
      }, (err, records) => (records || []).map(record => record.toObject()))

    return attendances
  }
}
