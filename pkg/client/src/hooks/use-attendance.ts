import { useState, useEffect } from 'react';
import { gql } from 'apollo-boost'
import { useLazyQuery, useQuery } from '@apollo/react-hooks'

import { Attendance, Lesson } from '../interfaces'

interface AttendanceResponse {
  attendancesByLessonId: Attendance[]
}

const ATTENDANCE_BY_LESSON_ID = gql`
  query attendanceByLessonId($lessonId: ID!) {
    attendancesByLessonId(lessonId: $lessonId) {
      id
      student {
        id
        person {
          firstName
          lastName
        }
      }
    }
  }
`

export function useAttendancesByLessonId(lessonId: string): [Attendance[] | undefined] {
  const [attendances, setAttendances] = useState<Attendance[]>();
  const { loading, error, data } = useQuery<AttendanceResponse>(
    ATTENDANCE_BY_LESSON_ID,
    {
      variables: { lessonId },
      fetchPolicy: 'no-cache'
    }
  )

  useEffect(() => {
    if (error) {
      setAttendances(undefined)
      return
    }
    if (loading) return
    if (!data) return
    setAttendances(data.attendancesByLessonId)
  }, [loading, error, data])

  return [attendances]
}