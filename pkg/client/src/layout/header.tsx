import React, { PropsWithChildren } from 'react'
import { AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'
import { times } from 'lodash'

export interface HeaderProps {
  backButton?: boolean
  title: string
  actionControl?: React.ReactElement | null
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: 'none',
    },
    title: {
      flexGrow: 1,
    },
  }),
)

export const Header: React.FC<PropsWithChildren<HeaderProps>> = (props: PropsWithChildren<HeaderProps>) => {
  const classes = useStyles()
  const { title, actionControl, children } = props

  const childrenCount = React.Children.count(children)
  const hasChildren = childrenCount > 0

  return (
    <>
      <AppBar variant={"outlined"} position="fixed" className={hasChildren ? classes.root : undefined}>
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
        {
          children
        }
      </AppBar>
      <Toolbar />
      { times(childrenCount).map(() => <Toolbar />)}
    </>
  )
}

Header.defaultProps = {
  actionControl: null,
  backButton: false,
}