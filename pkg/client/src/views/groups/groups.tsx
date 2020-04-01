import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import { Group } from '../../interfaces'
import { Header } from '../../layout'

const GROUPS_QUERY = gql`
  {
    groupsThisYear {
      id
      name
      year
    }
  }
`

interface InitialQueryData {
  groupsThisYear: Group[]
}

export const Groups: React.FC = () => {
  const history = useHistory()
  const {
    loading,
    data,
  } = useQuery<InitialQueryData>(GROUPS_QUERY)
  const { groupsThisYear: groups = [] } = (data || {})
  const onGroupClick = useCallback((groupId: string) => () => history.push(`/groups/${groupId}`), [])

  return (
    <>
      <Header
        title="Мої групи"
      />
      <List component="nav" aria-label="groups list">
        {
          groups.map((group: Group) => {
            return (
              <ListItem
                button
                onClick={onGroupClick(group.id)}
                key={group.id}
              >
                <ListItemText primary={group.name} />
              </ListItem>
            )
          })
        }
      </List>
    </>
  )
}