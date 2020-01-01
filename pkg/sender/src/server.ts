import uuid from 'uuid'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { createApolloFetch } from 'apollo-fetch'
import { keyBy } from 'lodash'
import { flatMap } from 'rxjs/operators'

import senderDb from './config/db'
import { listenToQueue, Queues } from './config/amqp'
import { router as viberRouter, sendTextMessage, setWebHook } from './clients/viber'

const uri = process.env.GRAPHQL_SERVER_URL

const queryStudent = `
  query Student($id: ID!) {
    student(id: $id) {
      person {
        firstName
        lastName
        id
      }
    }
  }
`

const queryParents = `
  query Parents($id: ID!) {
    parentsByStudentId(studentId: $id) {
      firstName
      lastName
      id
    }
  }
`
const apolloFetch = createApolloFetch({ uri })

const app = new Koa();

const port = process.env.PORT

app
  .use(bodyParser())
  .use(viberRouter.routes())
  .use(viberRouter.allowedMethods())

app.listen(port,() => {
  console.log(`🚀 Server is ready`)
  setWebHook()
})

interface UserAccessCodeMessage {
  code: string
  personId: string
}

interface AbsentStudentMessage {
  reports: Array<{
    studentId: string
    lessonNo: number
    date: string
    absenceReason: number
    group: string
    studentFirstName: string
    studentLastName: string
    subject: string
  }>
}

// returns 6-digit random number
function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000)
}

listenToQueue<UserAccessCodeMessage>(Queues.USER_ACCESS_CODE)
  .subscribe(async (msg) => {
    await senderDb.table('person_subscribers').insert({
      id: uuid(),
      person_id: msg.personId,
      code: generateRandomCode().toString(),
    })
  })

listenToQueue<AbsentStudentMessage>(Queues.ABSENT_STUDENT)
  .pipe(
    flatMap(msg => msg.reports.map(report => report)),
    flatMap(msg => {
      return apolloFetch({ query: queryParents, variables: { id: msg.studentId }})
        .then(({ data: { parentsByStudentId }, errors: parentError }) => {
          return {
            ...msg,
            parents: parentsByStudentId,
          }
        })
    }),
    flatMap(data => {
      const parentIds = data.parents.map((p: any) => p.id)
      const parentsData = keyBy(data.parents, 'id')
      // select all recipients (parents) of current student.
      return senderDb
        .from('person_subscribers')
        .where('person_id', 'in', parentIds)
        .then(records => {
          return records.map(record => {
            const parent = parentsData[record.person_id]
            return {
              receiverId: record.user_receiver_id,
              parentName: `${parent.lastName} ${parent.firstName}`,
              studentName: `${data.studentLastName} ${data.studentFirstName}`,
              subject: data.subject,
            }
          })
        })
    })
  )
  .subscribe(data => {
    Promise.all(data.map(d => {
      const text = `${d.parentName}, ваше чадо (${d.studentName}) прогуляло уроки!`
      return sendTextMessage(d.receiverId, text)
    }))
  })