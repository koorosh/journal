import React from 'react'
import { AppBar, createStyles, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'

export interface HeaderProps {
  title: string
  actionControl: React.ReactElement | null
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
  const { title, actionControl } = props
  return (
    <AppBar position="fixed">
      <Toolbar>
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
  actionControl: null
}