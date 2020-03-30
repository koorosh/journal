import { User } from '../models'
import { MongoDataSource } from '../db/mongo-datasource'

export class UserDataSource extends MongoDataSource<User> {
  constructor() {
    super('users');
  }

  async create(phone: string, password: string): Promise<User> {
    const userModel = new this.model({
      password,
      phone
    })
    return userModel.save()
  }
}
