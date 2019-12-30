import uuid from 'uuid'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { createApolloFetch } from 'apollo-fetch'
import { keyBy } from 'lodash'

import senderDb from './config/db'
import { listenToQueue, Queues } from './config/amqp'
import { router as viberRouter, sendTextMessage, setWebHook } from './clients/viber'
import { flatMap, map } from 'rxjs/operators'

const uri = 'http://localhost:4000/graphql'

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

const port = process.env.PORT || 8000;

app
  .use(bodyParser())
  .use(viberRouter.routes())
  .use(viberRouter.allowedMethods());

app.listen(port,() => {
  console.log(`🚀 Server is ready`)
  setWebHook()
})

interface UserAccessCodeMessage {
  code: string
  personId: string
}

interface AbsentStudentMessage {
  studentId: string
  absentDate?: Date
  lessonsMissed?: string[]
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
    flatMap(msg => apolloFetch([
        { query: queryStudent, variables: { id: msg.studentId }},
        { query: queryParents, variables: { id: msg.studentId }}
      ])),
    map(results => {
      const { data: { student }, errors: studentError } = results[0]
      const { data: { parentsByStudentId }, errors: parentError } = results[1]
      if (studentError) throw studentError
      if (parentError) throw parentError
      return {
        student,
        parents: parentsByStudentId
      }
    }),
    flatMap(data => {
      const { student, parents } = data
      const parentIds = parents.map(p => p.id)
      const parentsData = keyBy(parents, 'id')
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
              studentName: `${student.person.lastName} ${student.person.firstName}`
            }
          })
        })
    })
  )
  .subscribe((data: any[]) => {
    Promise.all(data.map(d => {
      const text = `${d.parentName}, ваше чадо (${d.studentName}) прогуляло уроки!`
      return sendTextMessage(d.receiverId, text)
    }))
  })