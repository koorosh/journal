import { Person } from '../models'
import { MongoDataSource } from '../db/mongo-datasource'

export class PersonDataSource extends MongoDataSource<Person> {
  constructor() {
    super('persons');
  }

  async create(firstName: string, lastName: string, middleName: string, phones: string[]): Promise<Person> {
    const personModel = new this.model({
      firstName,
      lastName,
      middleName,
      phones,
    })

    return  personModel.save()
  }
}
