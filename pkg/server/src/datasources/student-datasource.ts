import { DataSource } from 'apollo-datasource'
import { GroupsModel, PersonsModel, Student, StudentsModel } from '../models'

export class StudentDataSource extends DataSource {
  async selectAll(): Promise<Array<Student>> {
    const students = await StudentsModel.find(
      {},
      (err, records) => records.map(record => record.toObject())
    )
    return students
  }

  async findById(id: string): Promise<Student> {
    const student = await StudentsModel.findById(id)
      // group contains only one of many groups for current year.
      .populate({
        path: 'group',
        match: {
          year: { $eq: new Date().getFullYear() }
        }
      })
      .exec()
    return student.toObject()
  }

  async create(firstName: string, lastName: string, phone: string, groupId?: string): Promise<Student> {
    const personModel = await PersonsModel.create({
      firstName,
      lastName,
      phone
    })

    const studentModel = new StudentsModel({
      person: personModel
    })

    const student = await studentModel.save()

    if (groupId) {
      await GroupsModel.findByIdAndUpdate(groupId, { '$push': { 'students': student._id } })
    }

    return student.toObject()
  }
}
