import React, { PropsWithChildren } from 'react'
import { times } from 'lodash'
import { useHistory } from 'react-router-dom'
import { AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

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
  const history = useHistory()
  const { title, actionControl, children, backButton } = props

  const childrenCount = React.Children.count(children)
  const hasChildren = childrenCount > 0

  return (
    <>
      <AppBar variant={"outlined"} position="fixed" className={hasChildren ? classes.root : undefined}>
        <Toolbar disableGutters={backButton}>
          {
            backButton && (
              <IconButton
                color="inherit"
                onClick={history.goBack}
                aria-label="back"
              >
                <ChevronLeftIcon />
              </IconButton>
            )
          }
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