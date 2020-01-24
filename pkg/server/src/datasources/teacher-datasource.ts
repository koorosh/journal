import { DataSource } from 'apollo-datasource'
import { TeachersModel, Teacher, PersonsModel } from '../models'

export class TeacherDataSource extends DataSource {
  async selectAll(): Promise<Array<Teacher>> {
    const teachers = await TeachersModel.find(
      {},
      (err, records) => records.map(record => record.toObject())
    )
    return teachers
  }

  async currentTeacher(): Promise<Teacher> {
    const teachers = await TeachersModel.find(
      {},
      (err, records) => records.map(record => record.toObject())
    )
    return teachers[0]
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await TeachersModel.findById(id)
    return teacher.toObject()
  }

  async create(firstName: string, lastName: string, phone: string): Promise<Teacher> {
    const personModel = await PersonsModel.create({
      firstName,
      lastName,
      phone
    })
    const teacherModel = new TeachersModel({
      person: personModel
    })
    const teacher = await teacherModel.save()
    return teacher.toObject()
  }
}
