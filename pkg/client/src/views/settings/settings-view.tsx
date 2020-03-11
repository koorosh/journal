import React, { useCallback } from 'react'
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { useHistory } from "react-router-dom"
import Skeleton from '@material-ui/lab/Skeleton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import { Header } from '../../layout'
import { useCurrentUser } from '../../hooks'
import logoutUser from '../../core/logout-user'

export const SettingsView: React.FC = () => {
  const [user] = useCurrentUser()
  const history = useHistory()

  const onLogoutCLickHandler = useCallback(async () => {
    await logoutUser()
    history.push('/')
  }, [])

  return (
    <>
      <Header
        title="Налаштування"
      />
      <List component="nav">
        <ListItem>
          {
            user ?
              <ListItemText primary={`${user.person.lastName} ${user.person.firstName}`} /> :
              <Skeleton variant="text" width="60%" height="2rem"/>
          }
        </ListItem>
        <Divider />
        <ListItem
          button
          disabled={!user}
          onClick={onLogoutCLickHandler}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Вийти" />
        </ListItem>
      </List>
    </>
  )
}