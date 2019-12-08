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
      connection: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB
      }
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

  // private cacheQuery(ttl = 5, query: any) {
  //   const cacheKey = crypto
  //     .createHash("sha1")
  //     .update(query.toString())
  //     .digest("base64");
  //
  //   return this.cache.get(cacheKey).then(entry => {
  //     if (entry) return Promise.resolve(JSON.parse(entry));
  //
  //     return query.then(rows => {
  //       if (rows) this.cache.set(cacheKey, JSON.stringify(rows), { ttl });
  //
  //       return Promise.resolve(rows);
  //     });
  //   });
  // }
}

export default SqlDatasource
