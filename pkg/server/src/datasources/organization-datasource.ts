import { DataSource } from 'apollo-datasource'
import { Organization, OrganizationsModel } from '../models'

export class OrganizationDataSource extends DataSource {
  async selectAll(): Promise<Array<Organization>> {
    return OrganizationsModel.find({})
  }

  async findById(id: string): Promise<Organization> {
    const organization = await OrganizationsModel.findById(id)
    return organization.toObject()
  }

  async create(name: string, adminUserId: string): Promise<Organization> {
    const organizationModel = new OrganizationsModel({
      name,
      adminUser: adminUserId,
    })
    const organization = await organizationModel.save()
    return organization.toObject()
  }
}
