import React from 'react'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from "react-router-dom"
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      paddingBottom: 50,
    },
    list: {
      marginBottom: theme.spacing(2),
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto',
    },
  }),
);

export const Footer: React.FC = () => {
  const classes = useStyles()
  const location = useLocation()
  const history = useHistory()

  const handleNavigationChange = (event: React.ChangeEvent<{}>, path: string) => {
    history.push(path)
  }
  return (
    <BottomNavigation value={location.pathname} onChange={handleNavigationChange}>
      <BottomNavigationAction label="Головна" value="/" icon={<HomeOutlinedIcon />} />
      <BottomNavigationAction label="Відвідуваність" value="/attendance" icon={<PeopleAltOutlinedIcon />} />
    </BottomNavigation>
  )
}