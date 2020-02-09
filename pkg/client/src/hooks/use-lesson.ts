import { useState, useEffect } from 'react';
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { parseISO } from 'date-fns'

import { Lesson } from '../interfaces'

interface LessonResponse {
  lesson: Lesson
}

const LESSON = gql`
  query lesson($id: ID!) {
    lesson(id: $id) {
      id
      order
      date
      group {
        id
        name
        students {
          id
          person {
            firstName
            lastName
          }
        }
      }
      subject {
        id
        name
      }
      lastAttendanceCheck
    }
  }
`

const parseLesson = (lessonResp: any) => {
  return {
    ...lessonResp,
    date: parseISO(lessonResp.date)
  }
}

export function useLesson(id: string): [Lesson | undefined] {
  const [lesson, setLesson] = useState<Lesson>();
  const { loading, error, data } = useQuery<LessonResponse>(
    LESSON,
    {
      variables: { id },
      fetchPolicy: 'no-cache'
    }
  )

  useEffect(() => {
    if (error) {
      setLesson(undefined)
      return
    }
    if (loading) return
    if (!data) return
    setLesson(parseLesson(data.lesson))
  }, [loading, error, data])

  return [lesson]
}