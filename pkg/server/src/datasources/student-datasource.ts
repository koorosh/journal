import { DataSource } from 'apollo-datasource'
import { GroupsModel, ParentsModel, Person, PersonsModel, Student, StudentsModel } from '../models'

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

  async create(
    firstName: string,
    lastName: string,
    middleName: string,
    phones: string[],
    groupId?: string,
    parentPersons?: Person[]
  ): Promise<Student> {

    // Iterate over persons and update with the same values to ensure that we
    // do not insert any duplicates
    const parentPersonsData = await Promise.all((parentPersons || []).map(p =>
      PersonsModel.findOneAndUpdate(p, p, { new: true, upsert: true })
    ))
    const parentModels = parentPersonsData.map(person =>
      ParentsModel.findOneAndUpdate(
        { person },
        { person },
        { new: true, upsert: true }
      )
    )

    const parents = await Promise.all(parentModels)

    const personModel = await PersonsModel.create({
      firstName,
      lastName,
      middleName,
      phones,
      parents,
    })

    const studentModel = new StudentsModel({
      person: personModel
    })

    if (groupId) {
      await GroupsModel.findByIdAndUpdate(
        groupId,
        { '$push': { 'students': studentModel._id } },
        { upsert: true }
      )
    }
    const student = await studentModel.save()
    return student.toObject()
  }

  async createMany(students: any[]): Promise<Student[]> {
    return Promise.all(students.map(student => this.create(
      student.firstName,
      student.lastName,
      student.middleName,
      student.phones,
      student.groupId,
      student.parents,
    )))
  }
}
