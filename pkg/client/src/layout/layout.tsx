import React from 'react'
import {
  Container,
  CssBaseline,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  '@global': {
    'div#root': {
      height: '100vh',
    },
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
  },
  container: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
  },
}));

export const Layout: React.FC = props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth="sm" className={classes.container}>
          { props.children }
        </Container>
      </main>
    </div>
  );
}
