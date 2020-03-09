import { useState, useEffect } from 'react';
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import { User } from '../interfaces/user'

interface UserResponse {
  currentUser: User
}

const CURRENT_USER_QUERY = gql`
  query currentUser {
    currentUser {
      id
      roles,
      person {
        id
        firstName
        lastName
      }
    }
  }
`

export function useCurrentUser(): [User | undefined] {
  const [user, setUser] = useState<User>();
  const { loading, error, data } = useQuery<UserResponse>(CURRENT_USER_QUERY)

  useEffect(() => {
    if (error) {
      setUser(undefined)
      return
    }
    if (loading) return
    if (!data) return
    setUser(data.currentUser)
  }, [loading, error, data])

  return [user]
}