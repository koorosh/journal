import { DataSource, DataSourceConfig } from 'apollo-datasource'
import * as amqplib from 'amqplib'

export enum Queues {
  ABSENT_STUDENT = 'absent_student_q',
  REGISTER_USER = 'register_user_q',
  USER_ACCESS_CODE = 'user_access_code_q',
}

export class Publisher extends DataSource {
  constructor() {
    super()
    const host = process.env.CLOUDAMQP_URL
    this.connection = amqplib.connect(host)
      .then(connection => connection.createChannel())
  }

  private context: any
  private connection: Promise<amqplib.Channel>

  initialize(config: DataSourceConfig<any>) {
    this.context = config.context
  }

  publish<T>(queue: Queues, data: T) {
    this.connection.then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(data))))
  }
}