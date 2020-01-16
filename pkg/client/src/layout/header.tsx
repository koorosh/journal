import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'

export interface HeaderProps {
  title: string
  actionControl: React.ReactElement | null
}

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { title, actionControl } = props
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">
          {title}
        </Typography>
        {
          actionControl
        }
      </Toolbar>
    </AppBar>
  )
}

Header.defaultProps = {
  actionControl: null
}