import { DataSource } from 'apollo-datasource'
import { TeachersModel, Teacher, PersonsModel, UsersModel } from '../models'

export class TeacherDataSource extends DataSource {
  async selectAll(): Promise<Array<Teacher>> {
    const teachers = await TeachersModel.find(
      {},
      (err, records) => records.map(record => record.toObject())
    )
    return teachers
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await TeachersModel.findById(id)
    return teacher.toObject()
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
    const teacher = await teacherModel.save()
    return teacher.toObject()
  }

  async findTeacherByUserId(userId: string): Promise<Teacher> {
    const user = await UsersModel.findById(userId)
    const teacher = await TeachersModel.findOne({
      person: user.person
    })
    return teacher.toObject()
  }

}
