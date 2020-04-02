import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import PeopleIcon from '@material-ui/icons/People'
import SettingsIcon from '@material-ui/icons/Settings'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import logoutUser from '../core/logout-user'

interface MainDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const MainDrawer: React.FC<MainDrawerProps> = (props) => {
  const { isOpen, onClose } = props
  const history = useHistory()

  const onLogoutCLickHandler = useCallback(async () => {
    await logoutUser()
    history.push('/')
  }, [])

  const navigateTo = useCallback((path: string) => () => history.push(path), [])

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
    >
      <List>
        <ListItem button onClick={navigateTo('/')}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Головна" />
        </ListItem>
        <ListItem button onClick={navigateTo('/groups')}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Класи" />
        </ListItem>
        <ListItem button onClick={navigateTo('/reports')}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Звіти" />
        </ListItem>
        <Divider />
        <ListItem button onClick={navigateTo('/settings')}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Налаштування" />
        </ListItem>
        <ListItem button onClick={onLogoutCLickHandler}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Вийти" />
        </ListItem>
      </List>
    </Drawer>
  )
}