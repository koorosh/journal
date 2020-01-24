import { AttendancesModel, Attendance, AttendanceReason } from '../models'
import { DataSource } from 'apollo-datasource'

export class AttendanceDataSource extends DataSource {
  async create(
    studentId: string,
    lessonId: string,
    reason?: AttendanceReason,
  ) {
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
    const attendances = await AttendancesModel
      .find(
        { 'group.id': groupId },
        (err, results) => (results || []).map(result => result.toObject())
      ).exec()
    return attendances
  }

  async findById(id: string): Promise<Attendance> {
    const attendance = await AttendancesModel.findById(id).exec()
    return attendance.toObject()
  }
}
