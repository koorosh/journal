import * as amqplib from 'amqplib'
import {Observable, Subject} from 'rxjs'

const host = process.env.CLOUDAMQP_URL

const connection: Promise<amqplib.Channel> = amqplib.connect(host)
  .then(connection => connection.createChannel())

export enum Queues {
  ABSENT_STUDENT = 'absent_student_q',
  REGISTER_USER = 'register_user_q',
  USER_ACCESS_CODE = 'user_access_code_q',
}

export function publishToQueue<T>(queue: Queues, data: T) {
  connection.then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(data))))
}

export function listenToQueue<T>(queue: Queues): Observable<T> {
  const source$ = new Subject<T>()

  connection.then(async channel => {
    await channel.assertQueue(queue)
    await channel.consume(queue, msg => {
      if (msg) {
        const data: T = JSON.parse(msg.content.toString())
        source$.next(data)
        channel.ack(msg) // TODO: has to be ack after handling in code.
      }
    })
  })

  return source$.asObservable()
}

process.on('exit', () => {
  connection.then(async channel => {
    await channel.close()
    console.log(`Closing Amqp channel`)
  })
})
