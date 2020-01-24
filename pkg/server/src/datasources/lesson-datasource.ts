import { DataSource } from 'apollo-datasource'
import { Lesson, LessonsModel } from '../models'

export class LessonDataSource extends DataSource {
  async findById(id: string): Promise<Lesson> {
    const lesson = await LessonsModel.findById(id)
    return lesson.toObject()
  }

  async create(
    date: Date,
    order: number,
    subjectId: string,
    groupId: string,
    teacherId: string
  ): Promise<Lesson> {

    const lessonModel = new LessonsModel({
      date,
      order,
      subject: subjectId,
      group: groupId,
      teacher: teacherId,
    })

    const lesson = await lessonModel.save()
    return lesson.toObject()
  }

  async findLessonsByTeacherAndDate(teacherId: string, date: string): Promise<Lesson[]> {
    const lessons = await LessonsModel.find({
      teacher: teacherId,
      date,
    },
      (err, records) => records.map(record => record.toObject())).exec()
    return lessons
  }
}
