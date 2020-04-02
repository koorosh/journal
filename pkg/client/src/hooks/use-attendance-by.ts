import { useState, useEffect } from 'react';
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import { Attendance } from '../interfaces'

interface QueryResponse {
  attendancesByGroupIdAndDate: Attendance[]
}

interface AttendanceOptions {
  date?: Date
  // fromDate?: Date
  // toDate?: Date
  groupId?: string
  // lessonId?: string
}

const ATTENDANCE_BY = gql`
  query attendancesByGroupIdAndDate($groupId: ID!, $date: Date!) {
    attendancesByGroupIdAndDate(groupId: $groupId, date: $date) {
      id
      student {
        id
        person {
          id
          firstName
          lastName
        }
      }
      reason
    }
  }
`



export function useAttendanceBy(options: AttendanceOptions): Array<Attendance[]> {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const { loading, error, data } = useQuery<QueryResponse>(
    ATTENDANCE_BY,
    {
      variables: {
        ...options
      }
    }
  )

  useEffect(() => {
    if (error) {
      setAttendances([])
      return
    }
    if (loading) return
    if (!data) return
    setAttendances(data.attendancesByGroupIdAndDate)
  }, [loading, error, data])

  return [attendances]
}