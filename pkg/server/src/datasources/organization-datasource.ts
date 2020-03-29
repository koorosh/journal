import { Organization } from '../models'
import { MongoDataSource } from '../db/mongo-datasource'

export class OrganizationDataSource extends MongoDataSource<Organization> {
  constructor() {
    super('organizations', { globalTenant: true });
  }

  async create(data: any): Promise<Organization> {
    if (!this.context.user.roles.includes('god')) {
      return Promise.reject(new Error('Restricted area.'))
    }
    const organizationModel = new this.model(data)
    return organizationModel.save()
  }
}
