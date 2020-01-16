import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import {
  Checkbox,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'

import { Student } from '../../interfaces'


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

interface PathWithId {
  id: string
}

interface SelectedReportMap {
  [id: string]: boolean
}

export const AttendanceReport: React.FC = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const groupId = params.get('groupId')
  const date = params.get('date')

  const { loading, error, data = { getReportsByDateAndGroup: []}, } = useQuery<AttendanceReportResponse>(
    ATTENDANCE_REPORT_BY_ID_QUERY,
    {
      variables: { groupId, date },
    })

  const reports: AttendanceRecord[] = data.getReportsByDateAndGroup

  const [selectedRecords, selectRecord] = useState<SelectedReportMap>({})

  const handleRecordSelection = (key: string) => {
    selectRecord({
      ...selectedRecords,
      [key]: !selectedRecords[key]
    })
  }

  return (
    <>
      <Container maxWidth="sm">
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Ім'я</TableCell>
                <TableCell align="right">Предмет</TableCell>
                <TableCell align="right">Причина</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map(report => (
                <TableRow
                  key={report.id}
                  hover
                  onClick={() => handleRecordSelection(report.id)}
                  role="checkbox"
                  aria-checked={Boolean(selectedRecords[report.id])}
                  tabIndex={-1}
                  selected={Boolean(selectedRecords[report.id])}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={Boolean(selectedRecords[report.id])}/>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {`${report.studentLastName} ${report.studentFirstName}`}
                  </TableCell>
                  <TableCell align="right">{report.subjectName}</TableCell>
                  <TableCell align="right">{report.absenceReason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}