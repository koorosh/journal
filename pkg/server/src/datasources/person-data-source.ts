import { DataSource } from 'apollo-datasource'
import { PersonsModel, Person } from '../models'

export class PersonDataSource extends DataSource {
  async selectAll(): Promise<Array<Person>> {
    const persons = await PersonsModel.find(
      {},
      (err, records) => records.map(record => record.toObject())
    )
    return persons
  }

  async findById(id: string): Promise<Person> {
    const person = await PersonsModel.findById(id)
    return person.toObject()
  }

  async create(firstName: string, lastName: string, phone: string, groupId?: string): Promise<Person> {
    const personModel = new PersonsModel({
      firstName,
      lastName,
      phone
    })

    const person = await personModel.save()

    return person.toObject()
  }
}
