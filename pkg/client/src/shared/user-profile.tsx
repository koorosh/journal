import React from 'react'
import { Avatar, createStyles, Theme } from '@material-ui/core'
import { deepOrange } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'

import { useCurrentUser } from '../hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
  }),
)

export const UserProfile: React.FC = () => {
  const classes = useStyles()
  const [user] = useCurrentUser()
  return (
    <Avatar className={classes.avatar}>
      {user?.person.lastName[0]}
    </Avatar>
  )
}