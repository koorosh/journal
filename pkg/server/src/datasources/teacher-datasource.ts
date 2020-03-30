import { Teacher } from '../models'
import { MongoDataSource } from '../db/mongo-datasource'

export class TeacherDataSource extends MongoDataSource<Teacher> {
  constructor() {
    super('teachers');
  }

  async create(data: Partial<Teacher>): Promise<Teacher> {
    const personModel = await this.context.dataSources.persons.model.create(data.person)
    const teacherModel = new this.model({
      person: personModel
    })
    return teacherModel.save()
  }

  async createAsPerson(personId: string): Promise<Teacher> {
    const person = await this.context.dataSources.persons.model.findById(personId)
    const teacherModel = new this.model({ person })
    return teacherModel.save()
  }

  async findTeacherByUserId(userId: string): Promise<Teacher> {
    const user = await this.context.dataSources.users.model.findById(userId)
    if (!user) {
      return null
    }
    return this.model.findOne({
      person: user.person
    })
  }
}
