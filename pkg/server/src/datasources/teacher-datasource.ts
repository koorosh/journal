import { DataSource } from 'apollo-datasource'
import { TeachersModel, Teacher, PersonsModel, UsersModel } from '../models'

export class TeacherDataSource extends DataSource {
  async selectAll(): Promise<Array<Teacher>> {
    return TeachersModel.find(
      {},
      (err, records) => records.map(record => record.toObject())
    )
  }

  async findById(id: string): Promise<Teacher> {
    return TeachersModel.findById(id)
  }

  async create(firstName: string, lastName: string, middleName: string, phones?: string[]): Promise<Teacher> {
    const personModel = await PersonsModel.create({
      firstName,
      lastName,
      middleName,
      phones
    })
    const teacherModel = new TeachersModel({
      person: personModel
    })
    return teacherModel.save()
  }

  async createAsPerson(personId: string): Promise<Teacher> {
    const person = await PersonsModel.findById(personId)
    const teacherModel = new TeachersModel({ person })
    return teacherModel.save()
  }

  async findTeacherByUserId(userId: string): Promise<Teacher> {
    const user = await UsersModel.findById(userId)
    return TeachersModel.findOne({
      person: user.person
    })
  }

}
