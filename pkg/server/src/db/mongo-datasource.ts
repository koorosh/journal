import { DataSource, DataSourceConfig } from 'apollo-datasource'

import { Context } from '../types'
import { Document, Model } from 'mongoose'
import { dbModelFactory } from '../models'
import { Models } from '../models/models'

export type DocumentModel<T> = T & Document

interface MongoDatasourceOptions {
  globalTenant?: boolean
}

export class MongoDataSource<T> extends DataSource {
  public context: Context
  public model: Model<DocumentModel<T>>

  constructor(private modelName: Models, private options: MongoDatasourceOptions = {}) {
    super();
  }

  async initialize({ context, cache}: DataSourceConfig<Context>) {
    this.context = context
    let tenantId: string = undefined
    if (!this.options.globalTenant) {
      tenantId = context.user ? context.user.tenantId : undefined
    }
    this.model = dbModelFactory(this.modelName, tenantId)
  }

  async findById(id: string): Promise<T> {
    return this.model.findById(id)
  }

  async find(condition: Partial<T>): Promise<T[]> {
    return this.model.find(condition)
  }

  async selectAll(): Promise<T[]> {
    return this.find({})
  }
}
