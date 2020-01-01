import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { publishToQueue, Queues } from '../config/amqp'

export class Publisher extends DataSource {
  constructor() {
    super()
  }

  private context: any

  initialize(config: DataSourceConfig<any>) {
    this.context = config.context
  }

  publish<T>(queue: Queues, data: T) {
    publishToQueue(queue, data)
  }
}