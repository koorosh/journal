import { DataSource } from 'apollo-datasource'
import { User, UsersModel } from '../models'

export class UserDataSource extends DataSource {
  async selectAll(): Promise<Array<User>> {
    return UsersModel.find({})
  }

  async findByPhone(phone: string): Promise<User> {
    const teacher = await UsersModel.findOne({ phone })
    return teacher.toObject()
  }

  async create(phone: string, password: string): Promise<User> {
    // TODO: validate code, if phone is taken
    const userModel = new UsersModel({
      password,
      phone
    })
    const user = await userModel.save()
    return user.toObject()
  }
}
