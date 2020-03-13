import { DataSource } from 'apollo-datasource'
import { Group, GroupsModel } from '../models'

export class GroupDataSource extends DataSource {
  async selectAll(): Promise<Array<Group>> {
    const groups = await GroupsModel.find({}).exec()
    return groups
  }

  async findById(id: string): Promise<Group> {
    const group = await GroupsModel.findById(id).exec()
    return group.toObject()
  }

  async findByYear(year: number): Promise<Group[]> {
    return GroupsModel.find({ year })
  }

  async create(name: string, year: number): Promise<Group> {
    const groupModel = new GroupsModel({ name, year })
    const group = await groupModel.save()
    return group.toObject()
  }

  async addStudent(groupId: string, studentId: string): Promise<Group> {
    const group = await GroupsModel
      .findByIdAndUpdate(groupId, { '$addToSet': { 'students': studentId } }, { runValidators: true })
      .exec()
    return group.toObject()
  }
}
