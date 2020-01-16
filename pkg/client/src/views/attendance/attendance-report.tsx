import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { groupBy, map, last, chain, isEmpty } from 'lodash'
import {
  Button,
  Checkbox,
   Divider, List, ListItem, ListItemSecondaryAction, ListItemText,
  Typography
} from '@material-ui/core'

import { getReasonName, Student } from '../../interfaces'
import { Header } from '../../layout'


// TODO: has to be queried from local state (saved right after the report created)
const ATTENDANCE_REPORT_BY_ID_QUERY = gql`
  query getReportsByDateAndGroup($groupId: ID!, $date: Date!) {
    getReportsByDateAndGroup(groupId: $groupId, date: $date) {
      id
      studentId
      lessonNo
      date
      absenceReason
      groupId
      groupName
      studentFirstName
      studentLastName
      subjectId
      subjectName
    }
  }
`

interface AttendanceRecord {
  id: string
  date: Date
  studentId: string
  studentFirstName: string
  studentLastName: string
  lessonNo: number
  absenceReason: number
  groupId: string
  groupName: string
  subjectId?: string
  subjectName?: string
}

interface AttendanceReportResponse {
  getReportsByDateAndGroup: AttendanceRecord[]
}

interface SelectedStudentsMap {
  [id: string]: boolean
}

export const AttendanceReport: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const params = new URLSearchParams(location.search)
  const groupId = params.get('groupId')
  const date = params.get('date')

  const { loading, error, data = { getReportsByDateAndGroup: []}, } = useQuery<AttendanceReportResponse>(
    ATTENDANCE_REPORT_BY_ID_QUERY,
    {
      variables: { groupId, date },
    })

  const reports: AttendanceRecord[] = data.getReportsByDateAndGroup

  const [selectedStudents, selectStudent] = useState<SelectedStudentsMap>({})

  const reportsByStudent = groupBy(reports, report => report.studentId)

  const listItems = map(reportsByStudent, (studentReports, studentId) => {
    const {
      studentFirstName,
      studentLastName,
    } = studentReports[0]

    const lessonRanges = chain(studentReports)
      .sortBy('lessonNo')
      .reduce((acc: Array<[number, number]>, item) => {
        const currentLessonNo = item.lessonNo
        const lastRange = last(acc)

        if (isEmpty(acc) || lastRange === undefined) {
          acc.push([currentLessonNo, currentLessonNo])
          return acc
        }

        if ((lastRange[1] + 1) === currentLessonNo) {
          lastRange[1] = currentLessonNo
        } else {
          acc.push([currentLessonNo, currentLessonNo])
        }
        return acc
      }, [])
      .map(lessonRange => {
        if (lessonRange[0] === lessonRange[1]) return lessonRange[0]
        return lessonRange.join(' - ')
      })
      .value()
    const lessonRangesStr = lessonRanges.join(', ')

    return (
      <>
        <ListItem
          button
          onClick={() => {
            selectStudent({
              ...selectedStudents,
              [studentId]: !selectedStudents[studentId],
            })
          }}
          key={studentId}
        >
          <ListItemText
            primary={`${studentLastName} ${studentFirstName}`}
            secondary={
              <>
                <Typography
                  variant="body2"
                >
                  Пропущені уроки: {lessonRangesStr}
                </Typography>
                <Typography
                  variant="body2"
                >
                  Дата: {new Date(Date.parse(date || '')).toLocaleDateString()}
                </Typography>
              </>
            }
          />
          <ListItemSecondaryAction>
            <Checkbox
              checked={Boolean(selectedStudents[studentId])}
              onChange={(e, checked) =>
                selectStudent({
                  ...selectedStudents,
                  [studentId]: checked,
                })}
              // edge="end"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
      </>
    )
  })

  return (
    <>
      <Header
        title="Результат"
        actionControl={
          <Button
            color="inherit"
            onClick={() => history.push('/')}
          >
            Відправити
          </Button>
        }
      />
      <List component="nav">
        {listItems}
      </List>
    </>
  )
}