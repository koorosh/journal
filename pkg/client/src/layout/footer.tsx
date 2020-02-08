import React from 'react'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import { useLocation, useHistory } from "react-router-dom"
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIcon from '@material-ui/icons/Assignment'
import SettingsIcon from '@material-ui/icons/Settings'

export const Footer: React.FC = () => {
  const location = useLocation()
  const history = useHistory()

  const handleNavigationChange = (event: React.ChangeEvent<{}>, path: string) => {
    history.push(path)
  }
  return (
    <BottomNavigation  value={location.pathname} onChange={handleNavigationChange}>
      <BottomNavigationAction label="Головна" value="/today" icon={<HomeIcon />} />
      <BottomNavigationAction label="Звіти" value="/reports" icon={<AssignmentIcon />} />
      <BottomNavigationAction label="Налаштування" value="/settings" icon={<SettingsIcon />} />
    </BottomNavigation>
  )
}