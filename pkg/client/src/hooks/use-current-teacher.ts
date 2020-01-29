import { useState, useEffect } from 'react';
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import { Teacher } from '../interfaces/teacher'

interface CurrentTeacherResponse {
  currentTeacher: Teacher
}

const CURRENT_TEACHER = gql`
  query currentTeacher {
    currentTeacher {
      id
      person {
        firstName
        lastName
        phone
      }
    }
  }
`

export function useCurrentTeacher(): [Teacher | undefined] {
  const [teacher, setTeacher] = useState<Teacher>();
  const { loading, error, data } = useQuery<CurrentTeacherResponse>(CURRENT_TEACHER)

  useEffect(() => {
    if (error) {
      setTeacher(undefined)
      return
    }
    if (loading) return
    if (!data) return
    setTeacher(data.currentTeacher)
  }, [loading, error, data])

  return [teacher]
}