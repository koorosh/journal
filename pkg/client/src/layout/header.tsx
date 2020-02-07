import React from 'react'
import { AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'

export interface HeaderProps {
  backButton?: boolean
  title: string
  actionControl?: React.ReactElement | null
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
  }),
)

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const classes = useStyles()
  const { title, actionControl, backButton } = props
  return (
    <AppBar position="fixed">
      <Toolbar>
        {/*<IconButton*/}
        {/*  edge="start"*/}
        {/*  color="inherit"*/}
        {/*  aria-label="menu">*/}
        {/*  <MenuIcon />*/}
        {/*</IconButton>*/}
        <Typography
          variant="h6"
          className={classes.title}
        >
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
  actionControl: null,
  backButton: false,
}