import { MongoDataSource } from '../db/mongo-datasource'
import { Attendance, AttendanceReason } from '../models'

export class AttendanceDataSource extends MongoDataSource<Attendance> {
  constructor() {
    super('attendances');
  }

  async create(
    studentId: string,
    lessonId: string,
    reason?: AttendanceReason,
  ): Promise<Attendance> {
    const model = new this.model({
      reason,
      lesson: lessonId,
      student: studentId
    })

    const attendance = await model.save()
    await this.context.dataSources.lessons.model.updateOne({
      _id: lessonId
    }, {
      lastAttendanceCheck: new Date()
    })
    return attendance.toObject()
  }

  async batchCreate(attendances: any[]) {
    return Promise.all(attendances.map(attendance =>
      this.create(attendance.studentId, attendance.lessonId, attendance.reason))
    )
  }

  async findByGroupAndDate(groupId: string, date: Date): Promise<Attendance[]> {
    const lessons = await this.context.dataSources.lessons.model.find({
      group: groupId,
      date
    })
    const attendances = await this.model.find({
      lesson: {
        $in: lessons.map(lesson => lesson._id)
      }
    })

    return attendances
  }

  async findByLessonId(lessonId: string): Promise<Attendance[]> {
    const attendances = await this.model
      .find({
        lesson: lessonId
      })

    return attendances
  }

  async removeByLessonId(lessonId: string) {
    return this.model.remove({
      lesson: lessonId
    })
  }
}
