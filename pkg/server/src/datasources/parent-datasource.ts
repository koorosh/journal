import { DataSource } from 'apollo-datasource'

import { Parent, PersonsModel, ParentsModel } from '../models'


export class ParentDataSource extends DataSource {
  async selectAll(): Promise<Array<Parent>> {
    const parents = await ParentsModel.find(
      {},
      (err, records) => records.map(record => record.toObject())
    )
    return parents
  }

  async findById(id: string): Promise<Parent> {
    const parent = await ParentsModel.findById(id).exec()
    return parent.toObject()
  }

  async create(firstName: string, lastName: string, phone: string, groupId?: string): Promise<Parent> {
    const personModel = await PersonsModel.create({
      firstName,
      lastName,
      phone
    })

    const parentModel = new ParentsModel({
      person: personModel
    })

    const parent = await parentModel.save()
    return parent.toObject()
  }
}
