import React, { useCallback } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { Header } from '../../layout'

export const GroupDashboard: React.FC = () => {
  const history = useHistory()
  const matchParams = useRouteMatch<{ groupId: string}>()
  const { groupId } = matchParams.params
  const onItemClick = useCallback((path: string) => () => history.push(path), [])
  return (
    <>
      <Header
        title="Мій клас"
      />
      <List component="nav">
        <ListItem button onClick={onItemClick(`/reports/attendance/${groupId}`)}>
          <ListItemIcon>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText primary="Звітний облік відвідуваності" />
        </ListItem>
      </List>
    </>
  )
}