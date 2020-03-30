import { Person, Student } from '../models'
import { MongoDataSource } from '../db/mongo-datasource'
import { getCurrentEducationYear } from '../helpers'

export class StudentDataSource extends MongoDataSource<Student> {
  constructor() {
    super('students');
  }

  async findById(id: string): Promise<Student> {
    return this.model.findById(id)
      .populate({
        path: 'group',
        match: {
          year: { $eq: getCurrentEducationYear() }
        }
      })
  }

  async create(
    firstName: string,
    lastName: string,
    middleName: string,
    phones: string[],
    groupId?: string,
    parentPersons?: Person[]
  ): Promise<Student> {
    const { persons: Persons, groups: Groups} = this.context.dataSources

    // Iterate over persons and update with the same values to ensure that we
    // do not insert any duplicates
    const parentPersonsData = await Promise.all((parentPersons || []).map(p =>
      Persons.model.findOneAndUpdate(p, p, { new: true, upsert: true })
    ))
    const parents = await Promise.all(parentPersonsData)

    const personModel = await Persons.model.create({
      firstName,
      lastName,
      middleName,
      phones,
      parents,
    })

    const studentModel = new this.model({
      person: personModel
    })

    if (groupId) {
      await Groups.model.findByIdAndUpdate(
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
