import {DataSource} from 'apollo-datasource'
import {InMemoryLRUCache} from 'apollo-server-caching'
import DataLoader from 'dataloader'
import Knex from 'knex'

import {Context} from '../types'

interface DataSourceConfig<TContext> {
  context: TContext;
  cache: InMemoryLRUCache;
}

abstract class SqlDatasource extends DataSource {
  constructor() {
    super()

    this.db = Knex({
      client: process.env.DB_CLIENT,
      connection: process.env.DATABASE_URL
    })

    this.loader = new DataLoader(rawQueries =>
      Promise.all(rawQueries.map(rawQuery => this.db.raw(rawQuery)))
    );

    this.cache = new InMemoryLRUCache<string>()
  }

  protected context: any
  protected db: Knex
  private cache: InMemoryLRUCache<string>
  private loader: DataLoader<any, any>

  initialize({ cache, context }: DataSourceConfig<Context>) {
    this.context = context;
    this.cache = cache || new InMemoryLRUCache()
  }
}

export default SqlDatasource
