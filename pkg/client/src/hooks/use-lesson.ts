import { useState, useEffect } from 'react';
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import { Lesson } from '../interfaces'

interface LessonResponse {
  lesson: Lesson
}

const LESSON = gql`
  query lesson($id: ID!) {
    lesson(id: $id) {
      id
      order
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
    }
  }
`

export function useLesson(id: string): [Lesson | undefined] {
  const [lesson, setLesson] = useState<Lesson>();
  const { loading, error, data } = useQuery<LessonResponse>(
    LESSON,
    {
      variables: { id }
    }
  )

  useEffect(() => {
    if (error) {
      setLesson(undefined)
      return
    }
    if (loading) return
    if (!data) return
    setLesson(data.lesson)
  }, [loading, error, data])

  return [lesson]
}