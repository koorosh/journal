import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { ApolloProvider } from '@apollo/react-hooks'

import './App.css';
import client from './graphql-client'

import { Attendance, AttendanceReport, Home } from './views'
import { Layout } from './layout'

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/attendance/report">
              <AttendanceReport />
            </Route>
            <Route path="/attendance">
              <Attendance />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
