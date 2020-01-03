import uuid from 'uuid'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { createApolloFetch } from 'apollo-fetch'
import { keyBy } from 'lodash'
import { throwError } from 'rxjs'
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

const queryReportById = `
  query AbsenceReport($id: ID!) {
    absenceReport(id: $id) {
      id
      subjectId
      studentId
      groupId
      absenceReason
      date
      lessonNo
    }
  }
`
const apolloFetch = createApolloFetch({ uri })

const app = new Koa()

const port = process.env.PORT

app
  .use(bodyParser())
  .use(viberRouter.routes())
  .use(viberRouter.allowedMethods())

app.listen(port, () => {
  console.log(`🚀 Server is ready`)
  setWebHook()
})

interface UserAccessCodeMessage {
  code: string
  personId: string
}

interface AbsentStudentMessage {
  reportId: string
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
    flatMap(({ reportId }) => {
      return apolloFetch({ query: queryReportById, variables: { id: reportId } })
        .then(({ data, errors }) => {
          if (errors) throwError(errors)
          const { absenceReport } = data

          const { studentId, groupId, subjectId, absenceReason, lessonNo, date } = absenceReport
          return {
            studentId,
            groupId,
            subjectId,
            absenceReason,
            lessonNo,
            date
          }
        })
    }),
    flatMap(msg => {
      const { studentId, subjectId, lessonNo, date } = msg
      return apolloFetch([
        { query: queryStudent, variables: { id: studentId } },
        { query: queryParents, variables: { id: studentId } }
      ])
        .then(([studentResponse, parentsResponse]) => {
          if (studentResponse.errors) throwError(studentResponse.errors)
          if (parentsResponse.errors) throwError(parentsResponse.errors)

          const student = studentResponse.data.student
          const parents = parentsResponse.data.parentsByStudentId
          const parentIds = parents.map(parent => parent.id)
          const parentsData = keyBy(parents, 'id')

          return senderDb
            .from('person_subscribers')
            .where('person_id', 'in', parentIds)
            .then(records => {
              return records.map(record => {
                const parent = parentsData[record.person_id]
                return {
                  receiverId: record.subscriber_id,
                  parentName: `${parent.lastName} ${parent.firstName}`,
                  studentName: `${student.person.lastName} ${student.person.firstName}`,
                  subject: subjectId,
                  date,
                  lessonNo
                }
              })
            })
        })
    })
  )
  .subscribe(data => {
    Promise.all(data.map(d => {
      const text = JSON.stringify(d, null, 2)
      return sendTextMessage(d.receiverId, text)
    }))
  })