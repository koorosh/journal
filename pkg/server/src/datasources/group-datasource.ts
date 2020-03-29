import { Group } from '../models'
import { MongoDataSource } from '../db/mongo-datasource'

export class GroupDataSource extends MongoDataSource<Group> {
  constructor() {
    super('groups');
  }

  async findByYear(year: number): Promise<Group[]> {
    return this.model.find({ year })
  }

  async create(name: string, year: number): Promise<Group> {
    const groupModel = new this.model({ name, year })
    return groupModel.save()
  }

  async addStudent(groupId: string, studentId: string): Promise<Group> {
    const group = await this.model
      .findByIdAndUpdate(groupId, { '$addToSet': { 'students': studentId } }, { runValidators: true })
      .exec()
    return group
  }
}
