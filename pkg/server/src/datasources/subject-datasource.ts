import { DataSource } from 'apollo-datasource'
import { Subject, SubjectsModel } from '../models'

export class SubjectDataSource extends DataSource {
  async selectAll(): Promise<Array<Subject>> {
    const subjects = await SubjectsModel.find(
      {},
      (err, records) => records.map(record => record.toObject())
    )
    return subjects
  }

  async findById(id: string): Promise<Subject> {
    const subject = await SubjectsModel.findById(id)
    return subject.toObject()
  }

  async create(name: string): Promise<Subject> {
    const subjectModel = new SubjectsModel({ name })
    const subject = await subjectModel.save()
    return subject.toObject()
  }
}
