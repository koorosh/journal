import { Parent } from '../models'
import { MongoDataSource } from '../db/mongo-datasource'

export class ParentDataSource extends MongoDataSource<Parent> {
  constructor() {
    super('parents');
  }

  async create(firstName: string, lastName: string, middleName: string, phones: string, groupId?: string): Promise<Parent> {
    const personModel = await this.model.create({
      firstName,
      lastName,
      middleName,
      phones
    })

    const parentModel = new this.model({
      person: personModel
    })

    return parentModel.save()
  }
}
