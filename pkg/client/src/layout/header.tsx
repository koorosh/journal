import React, { PropsWithChildren, useState } from 'react'
import { times } from 'lodash'
import {
  AppBar,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { MainDrawer } from './main-drawer'

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
    menuButton: {
      marginRight: theme.spacing(2),
    },
  }),
)

export const Header: React.FC<PropsWithChildren<HeaderProps>> = (props: PropsWithChildren<HeaderProps>) => {
  const classes = useStyles()
  const { title, actionControl, children } = props
  const [isOpenDrawer, setDrawerState] = useState(false)
  const childrenCount = React.Children.count(children)
  const hasChildren = childrenCount > 0

  return (
    <>
      <AppBar
        variant={"outlined"}
        position="fixed"
        className={hasChildren ? classes.root : undefined}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerState(true)}
          >
            <MenuIcon />
          </IconButton>
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
      <MainDrawer isOpen={isOpenDrawer} onClose={() => setDrawerState(false)} />
      { times(childrenCount).map(() => <Toolbar />)}
    </>
  )
}

Header.defaultProps = {
  actionControl: null,
  backButton: false,
}