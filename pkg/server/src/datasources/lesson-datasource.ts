import { Lesson } from '../models'
import { MongoDataSource } from '../db/mongo-datasource'

export class LessonDataSource extends MongoDataSource<Lesson> {
  constructor() {
    super('lessons');
  }

  async create(
    date: Date,
    order: number,
    subjectId: string,
    groupId: string,
    teacherId: string
  ): Promise<Lesson> {

    const lessonModel = new this.model({
      date,
      order,
      subject: subjectId,
      group: groupId,
      teacher: teacherId,
    })

    return lessonModel.save()
  }

  async findLessonsByTeacherAndDate(teacherId: string, date: string): Promise<Lesson[]> {
    const lessons = await this.model.find({
      teacher: teacherId,
      date,
    })
    return lessons
  }
}
