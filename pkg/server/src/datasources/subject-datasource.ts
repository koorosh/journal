import { Subject } from '../models'
import { MongoDataSource } from '../db/mongo-datasource'

export class SubjectDataSource extends MongoDataSource<Subject> {
  constructor() {
    super('subjects');
  }

  async create(name: string): Promise<Subject> {
    const subjectModel = new this.model({ name })
    return subjectModel.save()
  }
}
