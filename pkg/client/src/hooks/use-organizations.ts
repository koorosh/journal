import { useState, useEffect } from 'react';
import { gql } from 'apollo-boost'
import { useLazyQuery, useQuery } from '@apollo/react-hooks'

import { Organization } from '../interfaces'

interface OrganizationsResponse {
  organizations: Organization[]
}

const ORGANIZATIONS = gql`
  query organizations {
    organizations {
      id
      name
    }
  }
`

export function useOrganizations(): [Organization[] | undefined] {
  const [organizations, setOrganizations] = useState<Organization[]>();
  const { loading, error, data } = useQuery<OrganizationsResponse>(ORGANIZATIONS)

  useEffect(() => {
    if (error) {
      setOrganizations(undefined)
      return
    }
    if (loading) return
    if (!data) return
    setOrganizations(data.organizations)
  }, [loading, error, data])

  return [organizations]
}