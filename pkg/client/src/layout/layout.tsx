import React, { PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import { Footer } from './footer'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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
        <Container maxWidth="lg" className={classes.container}>
          { props.children }
        </Container>
      </main>
      <Footer/>
    </div>
  );
}
