import { DataSource } from 'apollo-datasource'
import { User, UsersModel } from '../models'

export class UserDataSource extends DataSource {
  async selectAll(): Promise<Array<User>> {
    return UsersModel.find({})
  }

  async findById(phone: string): Promise<User> {
    const user = await UsersModel.findOne({ phone })
    return user.toObject()
  }

  async create(phone: string, password: string): Promise<User> {
    const userModel = new UsersModel({
      password,
      phone
    })
    const user = await userModel.save()
    return user.toObject()
  }
}
