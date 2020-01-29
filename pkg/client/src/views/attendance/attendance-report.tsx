import React from 'react'
import { useHistory } from 'react-router-dom'
import { parseISO } from 'date-fns'
import {
  Button,
  Paper,
  Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'

import { Header } from '../../layout'
import { useAttendanceBy } from '../../hooks/use-attendance-by'
import { Attendance, AttendanceReason, Student } from '../../interfaces'

interface AttendanceItem {
  [key: string]: {
    items: Attendance[]
    student: Student
    reason: AttendanceReason | null
  }
}

export const AttendanceReport: React.FC = () => {
  const history = useHistory()

  const searchParams = new URLSearchParams(history.location.search)

  const dateStr = searchParams.get('date')
  const groupId = searchParams.get('groupId') || undefined
  let date: Date | undefined = undefined

  if (dateStr) {
    date = parseISO(dateStr)
  }

  const [attendances] = useAttendanceBy({ groupId, date })

  const rows = attendances.reduce((acc: AttendanceItem, item) => {
    if (acc[item.student.id]) {
      acc[item.student.id] = {
        items: [item],
        student: item.student,
        reason: null
      }
    } else {
      acc[item.student.id].items.push(item)
    }
    return acc
  }, {})

  return (
    <>
      <Header
        title="Результат"
        actionControl={
          <Button
            color="inherit"
            onClick={() => {}}
          >
            Облік відвідуваності
          </Button>
        }
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ПІБ</TableCell>
              <TableCell align="right">Причина</TableCell>
              <TableCell align="right"/>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(rows).map((row, idx) => (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {`${row.student.person.lastName} ${row.student.person.firstName}`}
                </TableCell>
                <TableCell align="right">{row.items.length}</TableCell>
                <TableCell align="right">{row.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}