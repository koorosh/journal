import React, { PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Footer } from './footer'

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
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
  },
}));

export interface LayoutProps {

}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = (props: PropsWithChildren<LayoutProps>) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth="sm" className={classes.container}>
          { props.children }
        </Container>
      </main>
      <Footer />
    </div>
  );
}
